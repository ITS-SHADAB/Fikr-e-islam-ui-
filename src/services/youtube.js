import API from './api.js';

// ─── Connection ───────────────────────────────────────────────────────────────

/** Returns { url } — the Google consent screen URL */
export const getYoutubeAuthUrl = async () => {
  const res = await API.get('/youtube/auth-url');
  return res.data;
};

/** Returns { connection } or { connection: null } */
export const getConnectionStatus = async () => {
  const res = await API.get('/youtube/connection');
  return res.data;
};

/** Deletes the stored OAuth connection */
export const disconnectYoutube = async () => {
  const res = await API.delete('/youtube/connection');
  return res.data;
};

// ─── Videos ──────────────────────────────────────────────────────────────────

/**
 * Upload a video to YouTube.
 * @param {FormData} formData — fields: title, description, tags (string), video (File), thumbnail (File|optional)
 * @param {Function} onProgress — (percent: number) => void
 */
export const uploadYoutubeVideo = async (formData, onProgress) => {
  const res = await API.post('/youtube/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    },
    timeout: 0, // disable timeout for large uploads
  });
  return res.data;
};

/** Returns { videos: [...] } */
export const getYoutubeVideos = async () => {
  const res = await API.get('/youtube/videos');
  return res.data;
};

/** Update title/description in YouTube + DB */
export const updateYoutubeVideo = async (id, { title, description }) => {
  const res = await API.put(`/youtube/videos/${id}`, { title, description });
  return res.data;
};

/** Delete video from YouTube + DB */
export const deleteYoutubeVideo = async (id) => {
  const res = await API.delete(`/youtube/videos/${id}`);
  return res.data;
};
