import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  ArrowRight,
  Save,
  AlertTriangle,
  FileText,
  CheckCircle,
  Eye,
  Search,
} from 'lucide-react';
import {
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} from '@/services';
import { useSettings } from '@/hooks/useSettings';
import { Input, PdfViewer, Table, ConfirmationBox } from '@/components';
import { BACKEND_URL } from '@/constants/urls';
import {
  ARTICLE_CATEGORIES,
  ARTICLE_TRANSLATIONS,
} from '@/utils/categories';

export default function ManageArticles() {
  const { settings } = useSettings();
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const language =
    settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  const [articles, setArticles] = useState([]);
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
    summary: '',
    category: 'QURAN_TAFSEER',
    tags: '',
    references: '',
    publishDate: '',
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [existingPdfUrl, setExistingPdfUrl] = useState(null);
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState('auto');
  const [previewTitle, setPreviewTitle] = useState('Preview');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Pagination & Filter State
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const limit = 10;

  const categories = ARTICLE_CATEGORIES;

  const loadArticles = async (
    pageNum = page,
    category = selectedCategory,
    search = searchTerm
  ) => {
    try {
      setLoading(true);
      const data = await getArticles({
        page: pageNum,
        limit,
        category,
        search,
      });
      setArticles(data?.articles || (Array.isArray(data) ? data : []));
      setPages(data?.pages || 1);
      setPage(data?.page || 1);
      setTotal(data?.total || 0);
    } catch (err) {
      console.error('Failed to load articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles(page, selectedCategory, searchTerm);
  }, [page, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadArticles(1, selectedCategory, searchTerm);
  };

  const handleCategoryFilter = (cat) => {
    setSelectedCategory(cat);
    setPage(1);
    loadArticles(1, cat, searchTerm);
  };

  const handlePageChange = (pageNum) => {
    setPage(pageNum);
    loadArticles(pageNum, selectedCategory, searchTerm);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const openCreateForm = () => {
    setActionError(null);
    setEditingId(null);
    setFormFields({
      title: '',
      summary: '',
      category: 'QURAN_TAFSEER',
      tags: '',
      references: '',
      publishDate: new Date().toISOString().split('T')[0],
    });
    setThumbnailFile(null);
    setPdfFile(null);
    setExistingPdfUrl(null);
    setExistingThumbnailUrl(null);
    setPreviewUrl(null);
    setIsPreviewOpen(false);
    setIsFormOpen(true);
    setSuccess(false);
  };

  const openEditForm = (article) => {
    setActionError(null);
    setEditingId(article?._id);

    const pdfUrl =
      article?.pdf?.url ||
      (typeof article?.pdf === 'string' ? article?.pdf : null);
    const thumbnailUrl =
      article?.featuredImage?.url ||
      (typeof article?.featuredImage === 'string'
        ? article?.featuredImage
        : null);

    setFormFields({
      title: article?.title || '',
      summary: article?.summary || '',
      category: article?.category || 'QURAN_TAFSEER',
      tags: article?.tags ? article?.tags?.join(', ') : '',
      references: article?.references ? article?.references?.join(', ') : '',
      publishDate: article?.publishDate
        ? new Date(article?.publishDate).toISOString().split('T')[0]
        : '',
    });
    setThumbnailFile(null);
    setPdfFile(null);
    setExistingPdfUrl(pdfUrl);
    setExistingThumbnailUrl(thumbnailUrl);
    setPreviewUrl(null);
    setIsPreviewOpen(false);
    setIsFormOpen(true);
    setSuccess(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setActionError(null);
    setActionLoading(true);

    if (!editingId && !thumbnailFile) {
      setActionError(
        language === 'en'
          ? 'Featured Image file is required'
          : 'نمایاں تصویر کی فائل درکار ہے'
      );
      setActionLoading(false);
      return;
    }
    if (!editingId && !pdfFile) {
      setActionError(
        language === 'en'
          ? 'PDF file is required'
          : 'پی ڈی ایف فائل درکار ہے'
      );
      setActionLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', formFields.title);
    formData.append('summary', formFields.summary);
    formData.append('category', formFields.category);
    if (formFields.publishDate) {
      formData.append('publishDate', formFields.publishDate);
    }
    formData.append('tags', formFields.tags);
    formData.append('references', formFields.references);

    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile);
    }
    if (pdfFile) {
      formData.append('pdf', pdfFile);
    }

    try {
      if (editingId) {
        await updateArticle(editingId, formData);
        showSuccess(
          language === 'en'
            ? 'Article updated successfully.'
            : 'مضمون کامیابی سے اپ ڈیٹ ہو گیا۔'
        );
      } else {
        await createArticle(formData);
        showSuccess(
          language === 'en'
            ? 'Article published successfully.'
            : 'مضمون کامیابی سے شائع ہو گیا۔'
        );
      }
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          err.message ||
          'Failed to save article'
      );
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
      await deleteArticle(id);
      showSuccess(
        language === 'en'
          ? 'Article deleted successfully.'
          : 'مضمون کامیابی سے حذف کر دیا گیا۔'
      );
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          err.message ||
          'Failed to delete article'
      );
    } finally {
      setDeleteTargetId(null);
    }
  };

  const showSuccess = (msg) => {
    setSuccess(true);
    setSuccessMsg(msg);
    setIsFormOpen(false);
    setEditingId(null);
    loadArticles();
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="bg-background py-10 min-h-[80vh] text-right" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Module Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-gray-300 pb-5 text-right">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/dashboard"
              className="p-2 border-2 border-gray-300 bg-white rounded text-slate-600 hover:text-accent hover:border-accent shrink-0 transition-colors"
            >
              <ArrowRight className="w-4.5 h-4.5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-primary font-serif">
                مقالات و مضامین کا انتظام
              </h1>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mt-0.5">
                علمی و تحقیقی مقالات شامل کریں، تبدیل کریں یا حذف کریں۔
              </p>
            </div>
          </div>

          {!isFormOpen && (
            <button
              onClick={openCreateForm}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded text-xs font-bold shadow-sm transition-all uppercase tracking-wider font-serif border-2 border-primary/60 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-accent" />
              مضمون شامل کریں
            </button>
          )}
        </div>

        {/* Success alert */}
        {success && (
          <div
            className={`bg-emerald-50 border-r-4 border-emerald-500 p-4 flex items-start gap-2.5 text-emerald-800 text-xs shadow-sm border-2 border-emerald-200 ${
              language === 'ur' ? 'text-right' : 'text-left'
            }`}
          >
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form vs List Routing */}
        {isFormOpen ? (
          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-md overflow-hidden">
            <div className="bg-primary islamic-pattern text-white px-6 py-4 border-b-2 border-accent/50 flex items-center justify-between">
              <h2 className="font-bold text-sm sm:text-md font-serif">
                {editingId
                  ? language === 'en'
                    ? 'Edit Article Details'
                    : 'مضمون کی تفصیلات میں ترمیم کریں'
                  : language === 'en'
                    ? 'Publish New Islamic Article'
                    : 'نیا علمی و تحقیقی مضمون شامل کریں'}
              </h2>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-xs text-secondary hover:text-white underline font-light border-b border-transparent hover:border-white transition-colors cursor-pointer"
              >
                {language === 'en' ? 'Cancel' : 'منسوخ کریں'}
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
              {/* Form action errors */}
              {actionError && (
                <div className="bg-red-50 border-r-4 border-red-500 p-4 flex items-start gap-2 text-red-700 text-xs shadow-sm border-2 border-red-200">
                  <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              {/* Title, Category & Publish Date */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-6">
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 tracking-wider">
                    {language === 'en' ? 'Article Title *' : 'مضمون کا عنوان *'}
                  </label>
                  <Input
                    type="text"
                    name="title"
                    value={formFields.title}
                    onChange={handleInputChange}
                    required
                    placeholder={
                      language === 'en'
                        ? 'Enter article title...'
                        : 'مضمون کا عنوان درج کریں...'
                    }
                    inputClassName="w-full px-3 py-2 text-sm bg-white border-2 border-gray-300 rounded-md outline-none focus:border-primary focus:bg-white transition-colors text-right"
                    border=""
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 tracking-wider">
                    {language === 'en' ? 'Category *' : 'زمرہ *'}
                  </label>
                  <select
                    name="category"
                    value={formFields.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 text-sm bg-white border-2 border-gray-300 rounded-md outline-none text-slate-700 focus:border-primary text-right"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.labelUr}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 tracking-wider">
                    {language === 'en' ? 'Publish Date' : 'تاریخ اشاعت'}
                  </label>
                  <input
                    type="date"
                    name="publishDate"
                    value={formFields.publishDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm bg-white border-2 border-gray-300 rounded-md outline-none text-slate-700 focus:border-primary text-right"
                  />
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 tracking-wider">
                  {language === 'en' ? 'Short Summary *' : 'مختصر خلاصہ *'}
                </label>
                <textarea
                  name="summary"
                  value={formFields.summary}
                  onChange={handleInputChange}
                  required
                  placeholder={
                    language === 'en'
                      ? 'Provide a concise overview of this article...'
                      : 'اس مضمون کا مختصر و جامع خلاصہ درج کریں...'
                  }
                  rows={3}
                  className="w-full px-3 py-2 text-sm bg-white border-2 border-gray-300 rounded-md outline-none focus:border-primary focus:bg-white transition-colors resize-y text-right"
                ></textarea>
              </div>

              {/* Files Upload: Featured Image & PDF */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Featured Image */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 tracking-wider">
                    {language === 'en' ? 'Featured Image (Cover)' : 'نمایاں تصویر (غلاف)'}{' '}
                    {!editingId && ' *'}
                  </label>
                  {thumbnailFile ? (
                    <div className="flex flex-col gap-2 p-2 bg-slate-50 border-2 border-dashed border-accent/60 rounded-md">
                      <div className="flex items-center justify-between text-xs">
                        <span
                          className="font-semibold text-slate-700 truncate max-w-[180px]"
                          title={thumbnailFile.name}
                        >
                          {thumbnailFile.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ({(thumbnailFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const url = URL.createObjectURL(thumbnailFile);
                            setPreviewUrl(url);
                            setPreviewType('image');
                            setPreviewTitle(
                              formFields.title || 'Featured Image Preview'
                            );
                            setIsPreviewOpen(true);
                          }}
                          className="flex-grow py-1 px-3 bg-primary text-white text-[11px] font-bold rounded hover:opacity-90 flex items-center justify-center gap-1 cursor-pointer border-0"
                        >
                          <Eye className="w-3.5 h-3.5 text-accent" />
                          پیش نظارہ
                        </button>
                        <button
                          type="button"
                          onClick={() => setThumbnailFile(null)}
                          className="py-1 px-3 bg-red-50 text-red-700 hover:bg-red-100 text-[11px] font-bold rounded flex items-center justify-center gap-1 cursor-pointer border border-red-200"
                        >
                          حذف کریں
                        </button>
                      </div>
                    </div>
                  ) : existingThumbnailUrl ? (
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setThumbnailFile(e.target.files[0])}
                        className="w-full px-3 py-1.5 text-xs bg-white border-2 border-gray-300 rounded-md outline-none focus:border-primary transition-colors text-right"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrl(existingThumbnailUrl);
                          setPreviewType('image');
                          setPreviewTitle(
                            formFields.title || 'Current Featured Image'
                          );
                          setIsPreviewOpen(true);
                        }}
                        className="py-1 px-3 bg-secondary hover:bg-secondary/80 text-primary text-[11px] font-bold rounded flex items-center justify-center gap-1 cursor-pointer border border-border"
                      >
                        <Eye className="w-3.5 h-3.5 text-accent" />
                        موجودہ تصویر دیکھیں
                      </button>
                    </div>
                  ) : (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setThumbnailFile(e.target.files[0])}
                      required={!editingId}
                      className="w-full px-3 py-2 text-xs bg-white border-2 border-gray-300 rounded-md outline-none focus:border-primary transition-colors text-right"
                    />
                  )}
                </div>

                {/* PDF File */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 tracking-wider">
                    {language === 'en' ? 'PDF Document' : 'پی ڈی ایف دستاویز'}{' '}
                    {!editingId && ' *'}
                  </label>
                  {pdfFile ? (
                    <div className="flex flex-col gap-2 p-2 bg-slate-50 border-2 border-dashed border-accent/60 rounded-md">
                      <div className="flex items-center justify-between text-xs">
                        <span
                          className="font-semibold text-slate-700 truncate max-w-[180px]"
                          title={pdfFile.name}
                        >
                          {pdfFile.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const url = URL.createObjectURL(pdfFile);
                            setPreviewUrl(url);
                            setPreviewType('pdf');
                            setPreviewTitle(
                              formFields.title || 'PDF Preview'
                            );
                            setIsPreviewOpen(true);
                          }}
                          className="flex-grow py-1 px-3 bg-primary text-white text-[11px] font-bold rounded hover:opacity-90 flex items-center justify-center gap-1 cursor-pointer border-0"
                        >
                          <Eye className="w-3.5 h-3.5 text-accent" />
                          پیش نظارہ
                        </button>
                        <button
                          type="button"
                          onClick={() => setPdfFile(null)}
                          className="py-1 px-3 bg-red-50 text-red-700 hover:bg-red-100 text-[11px] font-bold rounded flex items-center justify-center gap-1 cursor-pointer border border-red-200"
                        >
                          حذف کریں
                        </button>
                      </div>
                    </div>
                  ) : existingPdfUrl ? (
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setPdfFile(e.target.files[0])}
                        className="w-full px-3 py-1.5 text-xs bg-white border-2 border-gray-300 rounded-md outline-none focus:border-primary transition-colors text-right"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrl(existingPdfUrl);
                          setPreviewType('pdf');
                          setPreviewTitle(
                            formFields.title || 'Current PDF'
                          );
                          setIsPreviewOpen(true);
                        }}
                        className="py-1 px-3 bg-secondary hover:bg-secondary/80 text-primary text-[11px] font-bold rounded flex items-center justify-center gap-1 cursor-pointer border border-border"
                      >
                        <Eye className="w-3.5 h-3.5 text-accent" />
                        موجودہ پی ڈی ایف دیکھیں
                      </button>
                    </div>
                  ) : (
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setPdfFile(e.target.files[0])}
                      required={!editingId}
                      className="w-full px-3 py-2 text-xs bg-white border-2 border-gray-300 rounded-md outline-none focus:border-primary transition-colors text-right"
                    />
                  )}
                </div>
              </div>

              {/* Tags and References */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 tracking-wider">
                    {language === 'en'
                      ? 'Tags (separated by comma)'
                      : 'ٹیگز (کوما سے الگ کریں)'}
                  </label>
                  <Input
                    type="text"
                    name="tags"
                    value={formFields.tags}
                    onChange={handleInputChange}
                    placeholder={
                      language === 'en'
                        ? 'e.g. Fiqh, Zakat, Modern Business'
                        : 'مثال: فقہ، زکوٰۃ، جدید کاروبار'
                    }
                    inputClassName="w-full px-3 py-2 text-sm bg-white border-2 border-gray-300 rounded-md outline-none focus:border-primary focus:bg-white transition-colors text-right"
                    border=""
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 tracking-wider">
                    {language === 'en'
                      ? 'References / Sources (separated by comma)'
                      : 'حوالہ جات / مراجع (کوما سے الگ کریں)'}
                  </label>
                  <Input
                    type="text"
                    name="references"
                    value={formFields.references}
                    onChange={handleInputChange}
                    placeholder={
                      language === 'en'
                        ? 'e.g. Sahih Bukhari, Al-Mughni'
                        : 'مثال: صحیح بخاری، المغنی از ابن قدامہ'
                    }
                    inputClassName="w-full px-3 py-2 text-sm bg-white border-2 border-gray-300 rounded-md outline-none focus:border-primary focus:bg-white transition-colors text-right"
                    border=""
                  />
                </div>
              </div>

              {/* Action operations */}
              <div className="pt-5 border-t-2 border-gray-200 flex items-center justify-start gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 border-2 border-gray-400 text-slate-700 rounded text-xs font-bold hover:bg-slate-50 transition-colors uppercase tracking-wider font-serif cursor-pointer"
                >
                  {language === 'en' ? 'Cancel' : 'منسوخ کریں'}
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded text-xs font-bold shadow-sm transition-all uppercase tracking-wider font-serif disabled:opacity-50 border-2 border-primary/60 cursor-pointer"
                >
                  <Save className="w-4 h-4 text-accent" />
                  {actionLoading
                    ? language === 'en'
                      ? 'Saving...'
                      : 'محفوظ کیا جا رہا ہے...'
                    : language === 'en'
                      ? 'Save Article'
                      : 'مضمون محفوظ کریں'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Articles List Table with Toolbar and Pagination */
          <div className="space-y-4">
            {/* Search & Filter Toolbar */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
              <form
                onSubmit={handleSearchSubmit}
                className="relative w-full sm:w-72"
              >
                <input
                  type="text"
                  placeholder="مقالات تلاش کریں..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-primary transition-colors pr-8 pl-3 text-right"
                  dir="rtl"
                />
                <button
                  type="submit"
                  className="absolute top-2 text-slate-400 hover:text-primary right-2.5 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryFilter(e.target.value)}
                  className="border-2 border-gray-300 rounded px-3 py-1.5 text-xs outline-none bg-white text-slate-700 focus:border-primary text-right"
                  dir="rtl"
                >
                  <option value="">تمام زمرے</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.labelUr}
                    </option>
                  ))}
                </select>

                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded border border-gray-200 shrink-0">
                  مجموعی: {total}
                </span>
              </div>
            </div>

            {/* Main Table with Integrated Pagination */}
            <div className="bg-white border-2 border-gray-300 rounded-lg shadow-md overflow-hidden">
              <Table
                loadingTableContent={loading}
                data={articles}
                noRecordText="کوئی مضمون درج نہیں ہے"
                currentPage={page}
                totalPages={pages}
                totalItems={total}
                pageSize={limit}
                onPageChange={handlePageChange}
                onRowClick={(article) => openEditForm(article)}
                language="ur"
                tableLayout={[
                  {
                    headData: 'غلاف / تصویر',
                    bodyData: (article) => {
                      const imgSrc =
                        article?.featuredImage?.url ||
                        (typeof article?.featuredImage === 'string'
                          ? article?.featuredImage
                          : null);
                      const finalUrl = imgSrc
                        ? imgSrc?.startsWith('/')
                          ? `${BACKEND_URL}${imgSrc}`
                          : imgSrc
                        : null;
                      return (
                        <div className="w-12 h-12 rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-slate-100 flex items-center justify-center shrink-0 mx-auto">
                          {finalUrl ? (
                            <img
                              src={finalUrl}
                              alt={article?.title || ''}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <FileText className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      );
                    },
                    tdClassName:
                      'border-b border-gray-200 py-2.5 text-center w-16 shrink-0',
                  },
                  {
                    headData: 'عنوان',
                    bodyData: (article) => (
                      <div className="text-right">
                        <span className="font-bold font-serif max-w-xs truncate block text-primary">
                          {article?.title}
                        </span>
                        {article?.slug && (
                          <span className="text-[10px] text-slate-400 font-mono block truncate">
                            /{article?.slug}
                          </span>
                        )}
                      </div>
                    ),
                    tdClassName: 'border-b border-gray-200 py-3 text-right',
                  },
                  {
                    headData: 'زمرہ',
                    bodyData: (article) => (
                      <span className="bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-1 rounded-full border border-primary/20">
                        {ARTICLE_TRANSLATIONS[article?.category] ||
                          article?.category}
                      </span>
                    ),
                    tdClassName: 'border-b border-gray-200 py-3 text-right',
                  },
                  {
                    headData: 'اشاعت کی تاریخ',
                    bodyData: (article) => (
                      <span className="font-light text-xs text-slate-600 text-right">
                        {article?.publishDate
                          ? new Date(article?.publishDate).toLocaleDateString(
                              'ur-PK'
                            )
                          : '—'}
                      </span>
                    ),
                    tdClassName: 'border-b border-gray-200 py-3 text-right',
                  },
                  {
                    headData: 'مشاہدات',
                    bodyData: (article) => (
                      <span className="font-semibold text-xs text-accent">
                        {article?.viewCount || 0}
                      </span>
                    ),
                    tdClassName:
                      'border-b border-gray-200 py-3 text-center',
                  },
                  {
                    headData: 'پی ڈی ایف',
                    bodyData: (article) => {
                      const pdfUrl =
                        article?.pdf?.url ||
                        (typeof article?.pdf === 'string'
                          ? article?.pdf
                          : null);
                      return pdfUrl ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewUrl(pdfUrl);
                            setPreviewType('pdf');
                            setPreviewTitle(article?.title || 'PDF Preview');
                            setIsPreviewOpen(true);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>دیکھیں</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400">
                          موجود نہیں
                        </span>
                      );
                    },
                    tdClassName:
                      'border-b border-gray-200 py-3 text-center',
                  },
                  {
                    headData: 'اقدامات',
                    bodyData: (article) => (
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditForm(article);
                          }}
                          className="p-1.5 text-accent hover:bg-amber-50 rounded transition-colors border border-transparent hover:border-amber-300 cursor-pointer"
                          title="ترمیم کریں"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(article?._id);
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors border border-transparent hover:border-red-300 cursor-pointer"
                          title="حذف کریں"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ),
                    tdClassName: 'border-b border-gray-200 py-3 text-left',
                  },
                ]}
                theadClassName="border-b-2 border-gray-300 bg-primary"
                thClassName="px-4 py-3 text-xs font-bold text-white uppercase tracking-wider border-b-2 border-gray-300"
              />
            </div>
          </div>
        )}
      </div>

      {/* Media & PDF Preview modal */}
      {isPreviewOpen && previewUrl && (
        <PdfViewer
          url={previewUrl}
          type={previewType}
          title={previewTitle}
          isModal={true}
          onClose={() => {
            setIsPreviewOpen(false);
            if (previewUrl.startsWith('blob:')) {
              URL.revokeObjectURL(previewUrl);
            }
          }}
        />
      )}

      {/* Delete Article Confirmation Box */}
      <ConfirmationBox
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteTargetId(null);
        }}
        onConfirm={handleConfirmDelete}
        title={
          language === 'en'
            ? 'Delete Article'
            : 'مضمون حذف کرنے کی تصدیق'
        }
        message={
          language === 'en'
            ? 'Are you sure you want to delete this article?'
            : 'کیا آپ واقعی اس مضمون کو حذف کرنا چاہتے ہیں؟'
        }
        type="danger"
        confirmText={language === 'en' ? 'Delete' : 'ہاں، حذف کریں'}
        cancelText={language === 'en' ? 'Cancel' : 'منسوخ کریں'}
      />
    </div>
  );
}
