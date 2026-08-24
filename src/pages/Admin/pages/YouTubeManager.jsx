import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Youtube,
  ArrowLeft,
  Unplug,
  PlugZap,
  Upload,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  ExternalLink,
  Eye,
  Users,
  Video,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Sparkles,
  Info,
  Play,
  FileVideo,
  ImagePlus,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getYoutubeAuthUrl,
  getConnectionStatus,
  disconnectYoutube,
  uploadYoutubeVideo,
  getYoutubeVideos,
  updateYoutubeVideo,
  deleteYoutubeVideo,
} from '@/services';
import { ConfirmationBox } from '@/components';



// ─── Design Tokens ─────────────────────────────────────────────────────────
// A single source of truth for borders/radii/colors so every card in this
// page reads as one deliberate system instead of a pile of ad-hoc panels.
const THEME = {
  ytRed: 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)',
  ytRedLight: 'rgba(255, 0, 0, 0.06)',
  glowRed: '0 8px 24px -6px rgba(220, 38, 38, 0.35)',
  gradDark: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
  border: '#e2e8f0', // slate-200, used everywhere for a consistent line weight
  borderStrong: '#cbd5e1', // slate-300, used for interactive/hover borders
  cardRadius: '1.25rem', // rounded-3xl equivalent, one value reused everywhere
};

// ─── Status Badge ───────────────────────────────────────────────────────────
function StatusBadge({ active, children }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${active ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'
        }`}
    >
      <span className={`w-2 h-2 rounded-full ${active ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
      {children}
    </span>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div
      className="p-5 rounded-2xl bg-white transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex items-center justify-between"
      style={{ border: `1px solid ${THEME.border}` }}
    >
      <div className="space-y-1">
        <p className="text-[10px] tracking-wider text-slate-400 font-bold uppercase">{label}</p>
        <h3 className="text-xl font-black text-slate-800 tracking-tight">{value || '—'}</h3>
      </div>
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}14`, color, border: `1px solid ${color}30` }}
      >
        <Icon size={20} className="stroke-[2.5]" />
      </div>
    </div>
  );
}

// ─── Connection Panel ─────────────────────────────────────────────────────
function ConnectionPanel({ connection, onConnect, onDisconnect, loading }) {
  const isConnected = !!connection;

  return (
    <div
      className="rounded-3xl overflow-hidden bg-white"
      style={{ border: `1px solid ${THEME.border}`, boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)' }}
    >
      <div
        className="px-6 py-6 flex flex-col sm:flex-row items-center gap-4 justify-between text-center sm:text-left"
        style={{ background: THEME.gradDark, borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shrink-0"
            style={{ background: THEME.ytRed, border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <Youtube className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-white font-extrabold text-lg tracking-tight flex items-center gap-2 justify-center sm:justify-start">
              YouTube Channel Link
              <Sparkles size={14} className="text-amber-400" />
            </h2>
            <p className="text-slate-300 text-xs mt-0.5 font-light">
              Connect your channel to sync, list, and upload lectures or bayans
            </p>
          </div>
        </div>
        {isConnected ? <StatusBadge active>Connected</StatusBadge> : <StatusBadge active={false}>Disconnected</StatusBadge>}
      </div>

      <div className="p-6">
        {isConnected ? (
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto text-center sm:text-left">
              {connection.channelThumbnail ? (
                <img
                  src={connection.channelThumbnail}
                  alt="channel"
                  className="w-16 h-16 rounded-full object-cover"
                  style={{ border: '3px solid #ef4444' }}
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: THEME.ytRedLight, border: '2px solid #ef4444' }}
                >
                  <Youtube className="w-8 h-8 text-red-600" />
                </div>
              )}
              <div className="space-y-1">
                <h3 className="font-black text-slate-800 text-base">{connection.channelName}</h3>
                <p className="text-xs text-slate-500 font-medium flex items-center justify-center sm:justify-start gap-1">
                  <Users size={12} className="text-slate-400" />
                  <strong>{parseInt(connection.subscriberCount || 0).toLocaleString()}</strong> subscribers
                </p>
                <p className="text-[10px] text-slate-400 flex items-center justify-center sm:justify-start gap-1">
                  <Info size={10} />
                  Last synced: {connection.lastSyncedAt ? new Date(connection.lastSyncedAt).toLocaleString() : 'Never'}
                </p>
              </div>
            </div>

            <button
              onClick={onDisconnect}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors disabled:opacity-50"
              style={{ border: '1px solid #fecdd3' }}
            >
              {loading ? <Loader2 size={13} className="animate-spin" /> : <Unplug size={13} />}
              Disconnect Channel
            </button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <p className="text-slate-700 font-bold text-sm">No channel connected</p>
              <p className="text-xs text-slate-400 font-light max-w-lg">
                Link your YouTube channel with Google OAuth to publish videos and sync view analytics from this panel.
              </p>
            </div>
            <button
              onClick={onConnect}
              disabled={loading}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-extrabold text-white transition-transform active:scale-95 disabled:opacity-60"
              style={{ background: THEME.ytRed, boxShadow: THEME.glowRed }}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <PlugZap size={16} />}
              Connect YouTube Channel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Reusable bordered dropzone ─────────────────────────────────────────────
function FileDropzone({ file, accept, icon: Icon, label, hint, previewImage, onChange }) {
  return (
    <label
      className="flex-1 flex flex-col items-center justify-center gap-3 cursor-pointer rounded-2xl py-8 px-4 text-center transition-colors bg-slate-50 hover:bg-slate-100/70"
      style={{
        border: `2px dashed ${file ? '#6366f1' : THEME.borderStrong}`,
        background: file ? 'rgba(99,102,241,0.04)' : undefined,
      }}
    >
      {previewImage && file ? (
        <img src={previewImage} alt="preview" className="w-20 h-12 object-cover rounded-lg" style={{ border: `1px solid ${THEME.border}` }} />
      ) : (
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            background: file ? '#e0e7ff' : '#f1f5f9',
            color: file ? '#4f46e5' : '#94a3b8',
            border: `1px solid ${file ? '#c7d2fe' : THEME.border}`,
          }}
        >
          <Icon size={22} className="stroke-[2]" />
        </div>
      )}
      <div className="space-y-1">
        <p className="text-xs font-bold text-slate-700 max-w-[200px] truncate mx-auto">{file ? file.name : label}</p>
        <p className="text-[10px] text-slate-400 font-light">
          {file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : hint}
        </p>
      </div>
      <input type="file" accept={accept} className="sr-only" onChange={onChange} />
    </label>
  );
}

// ─── Upload Modal ────────────────────────────────────────────────────────────
// Rebuilt as a focused modal (rather than an always-open inline form) so the
// "create video" flow reads as one clearly bordered task, not a stretch of
// loose fields sitting in the middle of the page.
function UploadVideoModal({ onClose, onUploaded }) {
  const [fields, setFields] = useState({ title: '', description: '', tags: '' });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbFile, setThumbFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      setError('Please select a video file to upload.');
      return;
    }
    setError(null);
    setUploading(true);
    setProgress(0);

    const fd = new FormData();
    fd.append('title', fields.title);
    fd.append('description', fields.description);
    fd.append('tags', fields.tags);
    fd.append('video', videoFile);
    if (thumbFile) fd.append('thumbnail', thumbFile);

    try {
      const data = await uploadYoutubeVideo(fd, setProgress);
      toast.success('Video uploaded successfully!');
      onUploaded(data.video);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Video upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && !uploading && onClose()}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white overflow-hidden"
        style={{ border: `1px solid ${THEME.border}`, boxShadow: '0 24px 60px -12px rgba(15, 23, 42, 0.35)' }}
      >
        {/* Modal header - clear border-bottom separates it from the body */}
        <div
          className="px-6 py-5 flex items-center justify-between shrink-0"
          style={{ borderBottom: `1px solid ${THEME.border}` }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-50 text-indigo-600"
              style={{ border: '1px solid #e0e7ff' }}
            >
              <Upload className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-800 text-sm">Publish Video Lecture</h2>
              <p className="text-slate-400 text-[11px] font-light">Upload a lecture or recording directly to YouTube</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => !uploading && onClose()}
            disabled={uploading}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-40"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal body - scrollable, padded consistently */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="p-6 space-y-5 overflow-y-auto">
            {error && (
              <div
                className="flex items-start gap-2.5 text-rose-700 text-xs p-4 rounded-xl bg-rose-50"
                style={{ border: '1px solid #fecdd3' }}
              >
                <AlertTriangle size={15} className="shrink-0 mt-0.5 text-rose-500" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Section: metadata - grouped in its own bordered fieldset */}
            <fieldset className="rounded-2xl p-4 space-y-4" style={{ border: `1px solid ${THEME.border}` }}>
              <legend className="px-2 -ml-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Video details
              </legend>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Lecture title *
                </label>
                <input
                  name="title"
                  value={fields.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Quran Explanation - Surah Al-Baqarah"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl outline-none bg-white focus:border-indigo-500 transition-colors"
                  style={{ border: `1px solid ${THEME.border}` }}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  value={fields.description}
                  onChange={handleChange}
                  placeholder="Describe the topics covered in this lecture..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl outline-none bg-white focus:border-indigo-500 transition-colors resize-none"
                  style={{ border: `1px solid ${THEME.border}` }}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Tags (comma separated)
                </label>
                <input
                  name="tags"
                  value={fields.tags}
                  onChange={handleChange}
                  placeholder="islam, lecture, bayan, madrasa"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl outline-none bg-white focus:border-indigo-500 transition-colors"
                  style={{ border: `1px solid ${THEME.border}` }}
                />
              </div>
            </fieldset>

            {/* Section: files - separate fieldset, same border treatment for consistency */}
            <fieldset className="rounded-2xl p-4" style={{ border: `1px solid ${THEME.border}` }}>
              <legend className="px-2 -ml-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Media files
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FileDropzone
                  file={videoFile}
                  accept="video/*"
                  icon={FileVideo}
                  label="Select video file *"
                  hint="Drag or click (.mp4, .mov, etc.)"
                  onChange={(e) => setVideoFile(e.target.files[0] || null)}
                />
                <FileDropzone
                  file={thumbFile}
                  accept="image/*"
                  icon={ImagePlus}
                  label="Select thumbnail (optional)"
                  hint="JPG or PNG, up to 5MB"
                  previewImage={thumbFile ? URL.createObjectURL(thumbFile) : null}
                  onChange={(e) => setThumbFile(e.target.files[0] || null)}
                />
              </div>
            </fieldset>

            {uploading && (
              <div className="space-y-2 p-4 rounded-2xl bg-indigo-50/60" style={{ border: '1px solid #e0e7ff' }}>
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Loader2 size={13} className="animate-spin text-indigo-500" />
                    Uploading video...
                  </span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white overflow-hidden" style={{ border: `1px solid ${THEME.border}` }}>
                  <div
                    className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-indigo-500 to-indigo-600"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-light">
                  Don't close this window. Upload time depends on file size and connection speed.
                </p>
              </div>
            )}
          </div>

          {/* Modal footer - border-top pins the actions to a clear, consistent bar */}
          <div
            className="px-6 py-4 flex items-center justify-end gap-3 shrink-0 bg-slate-50/60"
            style={{ borderTop: `1px solid ${THEME.border}` }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 bg-white hover:bg-slate-100 transition-colors disabled:opacity-40"
              style={{ border: `1px solid ${THEME.border}` }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold text-white transition-transform active:scale-95 disabled:opacity-50"
              style={{ background: uploading ? '#94a3b8' : THEME.ytRed, boxShadow: uploading ? 'none' : THEME.glowRed }}
            >
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              {uploading ? 'Processing...' : 'Publish to YouTube'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Video Card ───────────────────────────────────────────────────────────
function VideoCard({ video, onDelete, onUpdate }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: video.title, description: video.description });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    setSaving(true);
    try {
      const data = await updateYoutubeVideo(video._id, form);
      toast.success('Video updated!');
      onUpdate(data.video);
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    setShowDeleteConfirm(false);
    setDeleting(true);
    try {
      await deleteYoutubeVideo(video._id);
      toast.success('Video deleted.');
      onDelete(video._id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed.');
      setDeleting(false);
    }
  };

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col bg-white transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group/card"
      style={{ border: `1px solid ${THEME.border}` }}
    >
      <div className="relative aspect-video bg-slate-950 overflow-hidden shrink-0" style={{ borderBottom: `1px solid ${THEME.border}` }}>
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Youtube className="w-10 h-10 text-slate-700" />
          </div>
        )}

        <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <a
            href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center scale-90 group-hover/card:scale-100 transition-transform"
          >
            <Play size={16} fill="currentColor" className="ml-0.5" />
          </a>
        </div>

        <div className="absolute bottom-2 right-2 flex items-center gap-1.5 text-[9px] font-extrabold text-white px-2 py-0.5 rounded-md bg-black/75">
          <Eye size={10} className="stroke-[2.5]" />
          {parseInt(video.viewCount || 0).toLocaleString()}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        {editing ? (
          <div className="space-y-2.5 flex-1 flex flex-col">
            <input
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg outline-none bg-white focus:border-indigo-500"
              style={{ border: `1px solid ${THEME.border}` }}
              placeholder="Video title"
              required
            />
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={2}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg outline-none bg-white focus:border-indigo-500 resize-none flex-1"
              style={{ border: `1px solid ${THEME.border}` }}
              placeholder="Video description"
            />
            <div className="flex gap-2 pt-1 justify-end">
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-500 bg-white hover:bg-slate-50"
                style={{ border: `1px solid ${THEME.border}` }}
              >
                <X size={10} /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-[10px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? <Loader2 size={10} className="animate-spin" /> : <Save size={10} />}
                Save
              </button>
            </div>
          </div>
        ) : (
          <>
            <h4 className="text-xs font-black text-slate-800 line-clamp-2 leading-relaxed flex-1">{video.title}</h4>
            {video.description && <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{video.description}</p>}
            <div className="flex items-center gap-2 mt-4 pt-3 justify-end" style={{ borderTop: `1px solid ${THEME.border}` }}>
              <a
                href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[9px] font-extrabold px-2.5 py-1.5 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                style={{ border: '1px solid #fecaca' }}
              >
                <ExternalLink size={9.5} /> Watch
              </a>
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1 text-[9px] font-extrabold px-2.5 py-1.5 rounded-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                style={{ border: '1px solid #e0e7ff' }}
              >
                <Edit2 size={9.5} /> Edit
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={deleting}
                className="flex items-center gap-1 text-[9px] font-extrabold px-2.5 py-1.5 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors ml-auto disabled:opacity-50"
                style={{ border: '1px solid #fecdd3' }}
              >
                {deleting ? <Loader2 size={9.5} className="animate-spin" /> : <Trash2 size={9.5} />}
                Delete
              </button>
            </div>
          </>
        )}
      </div>

      {/* Delete YouTube Video Confirmation Box */}
      <ConfirmationBox
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Delete YouTube Video"
        message={`Delete "${video.title}" from YouTube and the database? This action cannot be undone.`}
        type="danger"
        confirmText="Delete Video"
        cancelText="Cancel"
      />
    </div>
  );
}


// ─── Video Grid ─────────────────────────────────────────────────────────────
function VideoGrid({ videos, onDelete, onUpdate, loading }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
        <Loader2 size={32} className="animate-spin" />
        <span className="text-xs font-medium">Syncing videos with YouTube...</span>
      </div>
    );
  }

  if (!videos.length) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400 text-center rounded-2xl"
        style={{ border: `1px dashed ${THEME.borderStrong}` }}
      >
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-1">
          <Youtube size={32} className="opacity-30 text-slate-400" />
        </div>
        <p className="text-sm font-bold text-slate-700">No videos yet</p>
        <p className="text-xs text-slate-400 max-w-[280px] leading-relaxed mx-auto">
          Nothing has been published from this panel yet. Click "Add Video" to publish your first one.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {videos.map((v) => (
        <VideoCard key={v._id} video={v} onDelete={onDelete} onUpdate={onUpdate} />
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────
export default function YouTubeManager() {
  const [searchParams] = useSearchParams();
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

  const [connection, setConnection] = useState(null);
  const [videos, setVideos] = useState([]);
  const [connLoading, setConnLoading] = useState(true);
  const [videosLoading, setVideosLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const loadConnection = useCallback(async () => {
    try {
      setConnLoading(true);
      const data = await getConnectionStatus();
      setConnection(data.connection);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to load connection status');
      setConnection(null);
    } finally {
      setConnLoading(false);
    }
  }, []);

  const loadVideos = useCallback(async () => {
    try {
      setVideosLoading(true);
      const data = await getYoutubeVideos();
      setVideos(data.videos || []);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to load videos');
      setVideos([]);
    } finally {
      setVideosLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConnection();
    loadVideos();
  }, [loadConnection, loadVideos]);

  useEffect(() => {
    const connected = searchParams.get('connected');
    const error = searchParams.get('error');
    if (connected === 'true') {
      toast.success('YouTube channel connected successfully!');
      loadConnection();
      loadVideos();
    }
    if (error) toast.error(`Connection failed: ${decodeURIComponent(error)}`);
  }, [searchParams, loadConnection, loadVideos]);

  const handleConnect = async () => {
    setActionLoading(true);
    try {
      const data = await getYoutubeAuthUrl();
      window.location.href = data.url;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to get auth URL.');
      setActionLoading(false);
    }
  };

  const handleConfirmDisconnect = async () => {
    setShowDisconnectModal(false);
    setActionLoading(true);
    try {
      await disconnectYoutube();
      setConnection(null);
      setVideos([]);
      toast.success('Channel disconnected.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Disconnect failed.');
    } finally {
      setActionLoading(false);
    }
  };



  const handleUploaded = (newVideo) => setVideos((prev) => [newVideo, ...prev]);
  const handleDeleted = (id) => setVideos((prev) => prev.filter((v) => v._id !== id));
  const handleUpdated = (updated) => setVideos((prev) => prev.map((v) => (v._id === updated._id ? updated : v)));

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8" dir="ltr">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/dashboard"
              className="p-2.5 rounded-xl text-slate-500 bg-white hover:text-slate-900 transition-colors"
              style={{ border: `1px solid ${THEME.border}` }}
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <Youtube className="w-6 h-6 text-red-600 stroke-[2.5]" />
                YouTube Manager
              </h1>
              <p className="text-slate-400 text-xs mt-0.5 font-light">
                Configure connection, sync view statistics, and publish video lectures
              </p>
            </div>
          </div>

          {connection && (
            <div className="flex items-center gap-2.5">
              <button
                onClick={loadVideos}
                disabled={videosLoading}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 transition-colors text-slate-600 disabled:opacity-50"
                style={{ border: `1px solid ${THEME.border}` }}
              >
                <RefreshCw size={12} className={videosLoading ? 'animate-spin' : ''} />
                Sync Statistics
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold text-white transition-transform active:scale-95"
                style={{ background: THEME.ytRed, boxShadow: THEME.glowRed }}
              >
                <Plus size={14} />
                Add Video
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        {connection && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="YouTube Channel" value={connection.channelName} icon={Youtube} color="#ef4444" />
            <StatCard
              label="Channel Subscribers"
              value={parseInt(connection.subscriberCount || 0).toLocaleString()}
              icon={Users}
              color="#10b981"
            />
            <StatCard label="Synced Videos" value={videos.length} icon={Video} color="#6366f1" />
            <StatCard
              label="Total Video Views"
              value={videos.reduce((s, v) => s + parseInt(v.viewCount || 0), 0).toLocaleString()}
              icon={Eye}
              color="#f59e0b"
            />
          </div>
        )}

        {/* Connection card */}
        {connLoading ? (
          <div
            className="rounded-3xl p-6 flex items-center gap-4 animate-pulse bg-white"
            style={{ border: `1px solid ${THEME.border}` }}
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-200" />
            <div className="space-y-2.5 flex-1">
              <div className="h-3.5 bg-slate-200 rounded w-44" />
              <div className="h-2.5 bg-slate-100 rounded w-72" />
            </div>
          </div>
        ) : (
          <ConnectionPanel connection={connection} onConnect={handleConnect} onDisconnect={() => setShowDisconnectModal(true)} loading={actionLoading} />
        )}

        {/* Video gallery */}
        {!connLoading && connection && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3" style={{ borderBottom: `1px solid ${THEME.border}` }}>
              <h2 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                <Video size={16} className="text-indigo-500" />
                Synced Channel Content
                {videos.length > 0 && <span className="text-[11px] font-bold text-slate-400">({videos.length})</span>}
              </h2>
            </div>

            <div className="rounded-3xl p-5 bg-white" style={{ border: `1px solid ${THEME.border}` }}>
              <VideoGrid videos={videos} loading={videosLoading} onDelete={handleDeleted} onUpdate={handleUpdated} />
            </div>
          </div>
        )}

        {/* Not connected placeholder */}
        {!connLoading && !connection && (
          <div
            className="rounded-3xl py-20 flex flex-col items-center justify-center gap-4 text-slate-400 bg-white"
            style={{ border: `1px dashed ${THEME.borderStrong}` }}
          >
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-red-50" style={{ border: '1px solid #fee2e2' }}>
              <Youtube size={36} className="text-red-500 opacity-60" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-bold text-slate-700">Link your channel to begin</p>
              <p className="text-xs text-slate-400 font-light max-w-sm">
                Connecting your YouTube channel lets you publish videos directly from this panel.
              </p>
            </div>
          </div>
        )}
      </div>

      {showUploadModal && (
        <UploadVideoModal onClose={() => setShowUploadModal(false)} onUploaded={handleUploaded} />
      )}

      {/* Disconnect YouTube Channel Confirmation Box */}
      <ConfirmationBox
        isOpen={showDisconnectModal}
        onClose={() => setShowDisconnectModal(false)}
        onConfirm={handleConfirmDisconnect}
        title="Disconnect YouTube Channel"
        message="Are you sure you want to disconnect this YouTube channel? All synchronization will stop."
        type="warning"
        confirmText="Disconnect Channel"
        cancelText="Keep Connected"
      />
    </div>
  );
}