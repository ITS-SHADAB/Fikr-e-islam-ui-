import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ArrowRight, Save, AlertTriangle, Play, CheckCircle, Eye } from 'lucide-react';
import { getLectures, createLecture, updateLecture, deleteLecture } from '@/services';
import { useSettings } from '@/hooks/useSettings';
import { Input, Table, ConfirmationBox } from '@/components';

import { CATEGORY_MAP, LECTURE_TRANSLATIONS } from '@/utils/categories';

export default function ManageLectures() {
  const { settings } = useSettings();
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';


  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form Fields State
  const [formFields, setFormFields] = useState({
    title: '',
    description: '',
    category: 'YouTube Videos',
    videoUrl: '',
    thumbnail: '',
  });

  const categories = CATEGORY_MAP.lectures;

  const loadLectures = async () => {
    try {
      setLoading(true);
      const data = await getLectures();
      setLectures(Array.isArray(data) ? data : (data.lectures || []));
    } catch (err) {
      console.error('Failed to load lectures:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLectures();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const openCreateForm = () => {
    setActionError(null);
    setEditingId(null);
    setFormFields({
      title: '',
      description: '',
      category: 'YouTube Videos',
      videoUrl: '',
      thumbnail: '',
    });
    setIsFormOpen(true);
    setSuccess(false);
  };

  const openEditForm = (lec) => {
    setActionError(null);
    setEditingId(lec._id);
    setFormFields({
      title: lec.title,
      description: lec.description,
      category: lec.category,
      videoUrl: lec.videoUrl,
      thumbnail: lec.thumbnail || '',
    });
    setIsFormOpen(true);
    setSuccess(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setActionError(null);
    setActionLoading(true);

    try {
      if (editingId) {
        await updateLecture(editingId, formFields);
        showSuccess(language === 'en' ? 'Lecture updated successfully.' : 'بیان کامیابی سے اپ ڈیٹ ہو گیا۔');
      } else {
        await createLecture(formFields);
        showSuccess(language === 'en' ? 'Lecture added successfully.' : 'بیان کامیابی سے شامل ہو گیا۔');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || 'Failed to save lecture');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = (id) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    const id = deleteTargetId;
    setShowDeleteModal(false);
    setActionError(null);
    try {
      await deleteLecture(id);
      showSuccess(language === 'en' ? 'Lecture deleted successfully.' : 'بیان کامیابی سے حذف کر دیا گیا۔');
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || 'Failed to delete lecture');
    } finally {
      setDeleteTargetId(null);
    }
  };



  const showSuccess = (msg) => {
    setSuccess(true);
    setSuccessMsg(msg);
    setIsFormOpen(false);
    setEditingId(null);
    loadLectures();
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className={`bg-background py-10 min-h-[80vh] ${language === 'ur' ? 'text-right' : 'text-left'}`} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Module Header */}
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/50 pb-5 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
          <div className="flex items-center gap-3">
            <Link to="/admin/dashboard" className="p-2 border border-border bg-white rounded text-slate-500 hover:text-accent shrink-0">
              <ArrowRight className={`w-4.5 h-4.5 ${language === 'en' ? 'rotate-180' : ''}`} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-primary font-serif">{language === 'en' ? 'Manage Lectures' : 'بیانات کا انتظام'}</h1>
              <p className="text-xs text-slate-400 font-light">{language === 'en' ? 'Add, edit, or delete audio and video lectures.' : 'آڈیو اور ویڈیو بیانات شامل کریں، اپ ڈیٹ کریں یا حذف کریں'}</p>
            </div>
          </div>

          {!isFormOpen && (
            <button
              onClick={openCreateForm}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded text-xs font-bold shadow-sm transition-all uppercase tracking-wider font-serif"
            >
              <Plus className="w-4 h-4 text-accent" />
              {language === 'en' ? 'Add Lecture' : 'بیان شامل کریں'}
            </button>
          )}
        </div>

        {/* Success Alert banner */}
        {success && (
          <div className={`bg-emerald-50 border-r-4 border-emerald-500 p-4 flex items-start gap-2.5 text-emerald-800 text-xs shadow-xs ${language === 'ur' ? 'text-right' : 'text-left'}`}>
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form vs List Routing */}
        {isFormOpen ? (
          <div className="bg-white border border-border rounded-lg shadow-sm overflow-hidden">
            <div className="bg-primary islamic-pattern text-white px-6 py-4 border-b border-accent/35 flex items-center justify-between">
              <h2 className="font-bold text-sm sm:text-md font-serif">
                {editingId 
                  ? (language === 'en' ? 'Edit Lecture Details' : 'بیان کی تفصیلات میں ترمیم کریں') 
                  : (language === 'en' ? 'Add New Audio/Video Lecture' : 'نیا آڈیو/ویڈیو بیان شامل کریں')
                }
              </h2>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-xs text-secondary hover:text-white underline font-light"
              >
                {language === 'en' ? 'Cancel' : 'منسوخ کریں'}
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              
              {/* Alert error */}
              {actionError && (
                <div className={`bg-red-50 border-r-4 border-red-500 p-4 flex items-start gap-2 text-red-700 text-xs shrink-0 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
                  <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{language === 'en' ? 'Lecture Title *' : 'بیان کا عنوان *'}</label>
                  <Input
                    type="text"
                    name="title"
                    value={formFields.title}
                    onChange={handleInputChange}
                    required
                    placeholder={language === 'en' ? 'e.g. Self-Purification: Islamic Methodology' : 'مثال: تزکیہ نفس: اسلامی طریقہ کار'}
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent focus:bg-white transition-all ${language === 'ur' ? 'text-right' : 'text-left'}`}
                    border=""
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{language === 'en' ? 'Media Format *' : 'میڈیا فارمیٹ *'}</label>
                  <select
                    name="category"
                    value={formFields.category}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2.5 text-sm bg-slate-50 border border-border rounded outline-none text-slate-700 focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {language === 'en' ? cat.labelEn : cat.labelUr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Video URL & Thumbnail URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{language === 'en' ? 'Media URL (YouTube/Facebook/MP3 link) *' : 'میڈیا یو آر ایل (یوٹیوب/فیس بک/ایم پی 3 لنک) *'}</label>
                  <Input
                    type="url"
                    name="videoUrl"
                    value={formFields.videoUrl}
                    onChange={handleInputChange}
                    required
                    placeholder="https://www.youtube.com/watch?v=..."
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent focus:bg-white transition-all ${language === 'ur' ? 'text-right' : 'text-left'}`}
                    border=""
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{language === 'en' ? 'Thumbnail Image URL (Optional)' : 'تھمب نیل امیج یو آر ایل (اختیاری)'}</label>
                  <Input
                    type="text"
                    name="thumbnail"
                    value={formFields.thumbnail}
                    onChange={handleInputChange}
                    placeholder="https://example.com/thumbnail.jpg"
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent focus:bg-white transition-all ${language === 'ur' ? 'text-right' : 'text-left'}`}
                    border=""
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{language === 'en' ? 'Short Description *' : 'مختصر تفصیل *'}</label>
                <textarea
                  name="description"
                  value={formFields.description}
                  onChange={handleInputChange}
                  required
                  placeholder={language === 'en' ? 'Provide a brief overview of the topics discussed in this lecture...' : 'اس بیان میں زیر بحث موضوعات کا مختصر جائزہ فراہم کریں...'}
                  rows={4}
                  className={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent focus:bg-white transition-all resize-y ${language === 'ur' ? 'text-right' : 'text-left'}`}
                ></textarea>
              </div>

              {/* Form Action Controls */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-start gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-border text-slate-600 rounded text-xs font-bold hover:bg-slate-50 transition-colors uppercase tracking-wider font-serif"
                >
                  {language === 'en' ? 'Cancel' : 'منسوخ کریں'}
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex items-center gap-1.5 px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded text-xs font-bold shadow-sm transition-all uppercase tracking-wider font-serif disabled:opacity-50"
                >
                  <Save className="w-4 h-4 text-accent" />
                  {actionLoading 
                    ? (language === 'en' ? 'Saving...' : 'محفوظ ہو رہا ہے...') 
                    : (language === 'en' ? 'Save Lecture' : 'بیان محفوظ کریں')
                  }
                </button>
              </div>

            </form>
          </div>
        ) : (
          /* Lectures List Table */
          <div className="bg-white border border-border rounded-lg shadow-sm overflow-hidden">
            <Table
              loadingTableContent={loading}
              data={lectures}
              language={language}
              pageSize={10}
              noRecordText={language === 'en' ? 'No lectures uploaded yet' : 'کوئی بیان اپ لوڈ نہیں کیا گیا'}
              tableLayout={[
                {
                  headData: language === 'en' ? 'Title' : 'عنوان',
                  bodyData: (lec) => <span className={`font-bold font-serif max-w-xs truncate ${language === 'ur' ? 'text-right' : 'text-left'}`}>{lec.title}</span>,
                  tdClassName: language === 'ur' ? 'text-right' : 'text-left'
                },
                {
                  headData: language === 'en' ? 'Category' : 'زمرہ',
                  bodyData: (lec) => (
                    <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded">
                      {language === 'en' ? lec.category : (LECTURE_TRANSLATIONS[lec.category] || lec.category)}
                    </span>
                  ),
                  tdClassName: language === 'ur' ? 'text-right' : 'text-left'
                },
                {
                  headData: language === 'en' ? 'Video/Audio URL' : 'ویڈیو/آڈیو یو آر ایل',
                  bodyData: (lec) => <span className={`text-xs font-light text-slate-400 max-w-xs truncate select-all ${language === 'ur' ? 'text-right' : 'text-left'}`}>{lec.videoUrl}</span>,
                  tdClassName: language === 'ur' ? 'text-right' : 'text-left'
                },
                {
                  headData: language === 'en' ? 'Actions' : 'اقدامات',
                  bodyData: (lec) => (
                    <div className="inline-flex items-center gap-2">
                       {lec.videoUrl && (
                         <a
                           href={lec.videoUrl}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="p-1.5 text-slate-550 hover:bg-slate-100 rounded transition-colors flex items-center justify-center"
                           title={language === 'en' ? 'View Media' : 'بیان دیکھیں'}
                         >
                           <Eye className="w-4 h-4" />
                         </a>
                       )}
                       <button
                         onClick={() => openEditForm(lec)}
                         className="p-1.5 text-accent hover:bg-amber-50 rounded transition-colors"
                         title={language === 'en' ? 'Edit' : 'ترمیم کریں'}
                       >
                         <Edit2 className="w-4 h-4" />
                       </button>
                       <button
                         onClick={() => handleDelete(lec._id)}
                         className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                         title={language === 'en' ? 'Delete' : 'حذف کریں'}
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  ),
                  tdClassName: language === 'ur' ? 'text-left' : 'text-right'
                }
              ]}
            />
          </div>
        )}

      </div>

      {/* Delete Lecture Confirmation Box */}
      <ConfirmationBox
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteTargetId(null);
        }}
        onConfirm={handleConfirmDelete}
        title={language === 'en' ? 'Delete Lecture' : 'بیان حذف کرنے کی تصدیق'}
        message={language === 'en' ? 'Are you sure you want to delete this lecture?' : 'کیا آپ واقعی اس بیان کو حذف کرنا چاہتے ہیں؟'}
        type="danger"
        confirmText={language === 'en' ? 'Delete' : 'ہاں، حذف کریں'}
        cancelText={language === 'en' ? 'Cancel' : 'منسوخ کریں'}
      />
    </div>
  );
}


