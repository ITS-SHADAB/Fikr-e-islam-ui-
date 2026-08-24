import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ArrowRight, Save, AlertTriangle, FileText, CheckCircle, Eye, Upload } from 'lucide-react';
import { getArticles, createArticle, updateArticle, deleteArticle } from '@/services';
import { useSettings } from '@/hooks/useSettings';
import { Input, PdfViewer, Table, ConfirmationBox } from '@/components';

import { ARTICLE_CATEGORIES, ARTICLE_TRANSLATIONS } from '@/utils/categories';

export default function ManageArticles() {
  const { settings } = useSettings();
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';


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
    category: 'تفسیرِ قرآن',
    tags: '',
    references: '',
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [existingPdfUrl, setExistingPdfUrl] = useState(null);
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState('auto');
  const [previewTitle, setPreviewTitle] = useState('Preview');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const categories = ARTICLE_CATEGORIES;

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await getArticles({ limit: 100 });
      setArticles(data.articles || []);
    } catch (err) {
      console.error('Failed to load articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
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
      summary: '',
      category: 'QURAN_TAFSEER',
      tags: '',
      references: '',
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
    setEditingId(article._id);

    const categoryMap = {
      'تفسیرِ قرآن': 'QURAN_TAFSEER',
      'علومِ حدیث': 'HADITH_SCIENCES',
      'فقہ و فتاویٰ': 'FIQH_FATAWA',
      'عقائد': 'AQEEDAH',
      'سیرتِ نبوی ﷺ': 'SEERAH',
      'اسلامی تاریخ': 'ISLAMIC_HISTORY',
      'خاندانی و معاشرتی مسائل': 'FAMILY_SOCIAL_ISSUES',
      'تعلیم و تربیت': 'EDUCATION_UPBRINGING',
      'دعوت و اصلاح': 'DAWAH_REFORM',
      'متفرق اسلامی مضامین': 'MISC_ISLAMIC_TOPICS',
    };

    const pdfUrl = article.pdf?.url || (typeof article.pdf === 'string' ? article.pdf : null);
    const thumbnailUrl = article.featuredImage?.url || (typeof article.featuredImage === 'string' ? article.featuredImage : null);

    setFormFields({
      title: article.title,
      summary: article.summary,
      category: categoryMap[article.category] || article.category,
      tags: article.tags ? article.tags.join(', ') : '',
      references: article.references ? article.references.join(', ') : '',
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

    // Validation: files are required for creation!
    if (!editingId && !thumbnailFile) {
      setActionError(language === 'en' ? 'Featured Image file is required' : 'نمایاں تصویر کی فائل درکار ہے');
      setActionLoading(false);
      return;
    }
    if (!editingId && !pdfFile) {
      setActionError(language === 'en' ? 'PDF file is required' : 'پی ڈی ایف فائل درکار ہے');
      setActionLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', formFields.title);
    formData.append('summary', formFields.summary);
    formData.append('category', formFields.category);
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
        showSuccess(language === 'en' ? 'Article updated successfully.' : 'مضمون کامیابی کے ساتھ اپ ڈیٹ ہو گیا۔');
      } else {
        await createArticle(formData);
        showSuccess(language === 'en' ? 'Article published successfully.' : 'مضمون کامیابی کے ساتھ شائع ہو گیا۔');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || 'Failed to save article');
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
      showSuccess(language === 'en' ? 'Article deleted successfully.' : 'مضمون کامیابی کے ساتھ حذف کر دیا گیا۔');
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || 'Failed to delete article');
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
    <div className={`bg-background py-10 min-h-[80vh] ${language === 'ur' ? 'text-right' : 'text-left'}`} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Module Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/50 pb-5 text-right" dir="rtl">
          <div className="flex items-center gap-3">
            <Link to="/admin/dashboard" className="p-2 border border-border bg-white rounded text-slate-500 hover:text-accent shrink-0">
              <ArrowRight className="w-4.5 h-4.5" />
            </Link>
            <div className="flex flex-col gap-1.5">
              <h1 className="text-2xl font-bold text-primary font-serif leading-normal">مقالات کا انتظام</h1>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">عالم صاحب کے مقالات شامل کریں، تبدیل کریں یا حذف کریں۔</p>
            </div>
          </div>

          {!isFormOpen && (
            <button
              onClick={openCreateForm}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded text-xs font-bold shadow-sm transition-all uppercase tracking-wider font-serif cursor-pointer"
            >
              <Plus className="w-4 h-4 text-accent" />
              مضمون لکھیں
            </button>
          )}
        </div>

        {/* Action success alert banner */}
        {success && (
          <div className={`bg-emerald-50 border-r-4 border-emerald-500 p-4 flex items-start gap-2.5 text-emerald-800 text-xs shadow-xs ${language === 'ur' ? 'text-right' : 'text-left'}`}>
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Forms vs List router */}
        {isFormOpen ? (
          <div className="bg-white border border-border rounded-lg shadow-sm overflow-hidden">
            <div className="bg-primary islamic-pattern text-white px-6 py-4 border-b border-accent/35 flex items-center justify-between">
              <h2 className="font-bold text-sm sm:text-md font-serif">
                {editingId
                  ? (language === 'en' ? 'Edit Article' : 'مضمون کی تدوین کریں')
                  : (language === 'en' ? 'Write New Article' : 'نیا علمی مضمون لکھیں')
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

              {/* Form action errors */}
              {actionError && (
                <div className={`bg-red-50 border-r-4 border-red-500 p-4 flex items-start gap-2 text-red-700 text-xs shrink-0 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
                  <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{language === 'en' ? 'Article Title *' : 'مضمون کا عنوان *'}</label>
                  <Input
                    type="text"
                    name="title"
                    value={formFields.title}
                    onChange={handleInputChange}
                    required
                    placeholder={language === 'en' ? 'Enter article title...' : 'مضمون کا عنوان درج کریں...'}
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent focus:bg-white transition-all ${language === 'ur' ? 'text-right' : 'text-left'}`}
                    border=""
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{language === 'en' ? 'Category *' : 'زمرہ *'}</label>
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

              {/* Summary */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{language === 'en' ? 'Short Summary *' : 'موقع کا مختصر خلاصہ *'}</label>
                <Input
                  type="text"
                  name="summary"
                  value={formFields.summary}
                  onChange={handleInputChange}
                  required
                  placeholder={language === 'en' ? 'Enter short summary...' : 'مضمون کا مختصر خلاصہ درج کریں...'}
                  inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent focus:bg-white transition-all ${language === 'ur' ? 'text-right' : 'text-left'}`}
                  border=""
                />
              </div>

              {/* Tags, Featured Image, and PDF file */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{language === 'en' ? 'Tags (separated by comma)' : 'ٹیگز (کوما سے الگ کریں)'}</label>
                  <Input
                    type="text"
                    name="tags"
                    value={formFields.tags}
                    onChange={handleInputChange}
                    placeholder={language === 'en' ? 'e.g. Fiqh, Zakat, Modern Business' : 'مثال: فقہ، زکوٰۃ، جدید کاروبار'}
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent focus:bg-white transition-all ${language === 'ur' ? 'text-right' : 'text-left'}`}
                    border=""
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {language === 'en' ? 'Featured Image (JPEG/PNG)' : 'نمایاں تصویر'} {!editingId && ' *'}
                  </label>
                  {thumbnailFile ? (
                    <div className="flex flex-col gap-2 p-2 bg-slate-50 border border-dashed border-accent/40 rounded">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700 truncate max-w-[150px]" title={thumbnailFile.name}>{thumbnailFile.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({(thumbnailFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const url = URL.createObjectURL(thumbnailFile);
                            setPreviewUrl(url);
                            setPreviewType('image');
                            setPreviewTitle(formFields.title || 'Featured Image Preview');
                            setIsPreviewOpen(true);
                          }}
                          className="flex-grow py-1 px-3 bg-primary text-white text-[11px] font-bold rounded hover:opacity-90 flex items-center justify-center gap-1 cursor-pointer border-0"
                        >
                          <Eye className="w-3.5 h-3.5 text-accent" />
                          {language === 'en' ? 'Preview' : 'پیش نظارہ'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setThumbnailFile(null)}
                          className="py-1 px-3 bg-red-50 text-red-700 hover:bg-red-100 text-[11px] font-bold rounded flex items-center justify-center gap-1 cursor-pointer border border-red-200"
                        >
                          {language === 'en' ? 'Remove' : 'حذف کریں'}
                        </button>
                      </div>
                    </div>
                  ) : existingThumbnailUrl ? (
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setThumbnailFile(e.target.files[0])}
                        className={`w-full px-3 py-1.5 text-xs bg-slate-50 border border-border rounded outline-none ${language === 'ur' ? 'text-right' : 'text-left'}`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrl(existingThumbnailUrl);
                          setPreviewType('image');
                          setPreviewTitle(formFields.title || 'Current Featured Image');
                          setIsPreviewOpen(true);
                        }}
                        className="py-1 px-3 bg-secondary hover:bg-secondary/80 text-primary text-[11px] font-bold rounded flex items-center justify-center gap-1 cursor-pointer border border-border/40"
                      >
                        <Eye className="w-3.5 h-3.5 text-accent" />
                        {language === 'en' ? 'View Current Image' : 'موجودہ تصویر دیکھیں'}
                      </button>
                    </div>
                  ) : (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setThumbnailFile(e.target.files[0])}
                      required={!editingId}
                      className={`w-full px-3 py-2 text-xs bg-slate-50 border border-border rounded outline-none ${language === 'ur' ? 'text-right' : 'text-left'}`}
                    />
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {language === 'en' ? 'PDF Document' : 'پی ڈی ایف علمی مضمون'} {!editingId && ' *'}
                  </label>
                  {pdfFile ? (
                    <div className="flex flex-col gap-2 p-2 bg-slate-50 border border-dashed border-accent/40 rounded">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700 truncate max-w-[150px]" title={pdfFile.name}>{pdfFile.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const url = URL.createObjectURL(pdfFile);
                            setPreviewUrl(url);
                            setPreviewType('pdf');
                            setPreviewTitle(formFields.title || 'PDF Preview');
                            setIsPreviewOpen(true);
                          }}
                          className="flex-grow py-1 px-3 bg-primary text-white text-[11px] font-bold rounded hover:opacity-90 flex items-center justify-center gap-1 cursor-pointer border-0"
                        >
                          <Eye className="w-3.5 h-3.5 text-accent" />
                          {language === 'en' ? 'Preview' : 'پیش نظارہ'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setPdfFile(null)}
                          className="py-1 px-3 bg-red-50 text-red-700 hover:bg-red-100 text-[11px] font-bold rounded flex items-center justify-center gap-1 cursor-pointer border border-red-200"
                        >
                          {language === 'en' ? 'Remove' : 'حذف کریں'}
                        </button>
                      </div>
                    </div>
                  ) : existingPdfUrl ? (
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setPdfFile(e.target.files[0])}
                        className={`w-full px-3 py-1.5 text-xs bg-slate-50 border border-border rounded outline-none ${language === 'ur' ? 'text-right' : 'text-left'}`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrl(existingPdfUrl);
                          setPreviewType('pdf');
                          setPreviewTitle(formFields.title || 'Current PDF');
                          setIsPreviewOpen(true);
                        }}
                        className="py-1 px-3 bg-secondary hover:bg-secondary/80 text-primary text-[11px] font-bold rounded flex items-center justify-center gap-1 cursor-pointer border border-border/40"
                      >
                        <Eye className="w-3.5 h-3.5 text-accent" />
                        {language === 'en' ? 'View Current PDF' : 'موجودہ پی ڈی ایف دیکھیں'}
                      </button>
                    </div>
                  ) : (
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setPdfFile(e.target.files[0])}
                      required={!editingId}
                      className={`w-full px-3 py-2 text-xs bg-slate-50 border border-border rounded outline-none ${language === 'ur' ? 'text-right' : 'text-left'}`}
                    />
                  )}
                </div>
              </div>

              {/* References */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{language === 'en' ? 'References / Sources (separated by comma)' : 'حوالہ جات / مراجع (کوما سے الگ کریں)'}</label>
                <textarea
                  name="references"
                  value={formFields.references}
                  onChange={handleInputChange}
                  placeholder={language === 'en' ? 'e.g. Sahih Bukhari, Hadith No. 456, Al-Mughni by Ibn Qudamah' : 'مثال: صحیح بخاری، حدیث نمبر 456، المغنی از ابن قدامہ'}
                  rows={3}
                  className={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent focus:bg-white transition-all resize-y ${language === 'ur' ? 'text-right' : 'text-left'}`}
                ></textarea>
              </div>

              {/* Form CTA buttons */}
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
                    ? (language === 'en' ? 'Saving...' : 'محفوظ کیا جا رہا ہے...')
                    : (language === 'en' ? 'Save Article' : 'مضمون محفوظ کریں')
                  }
                </button>
              </div>

            </form>
          </div>
        ) : (
          /* Articles List Table */
          <div className="bg-white border border-border rounded-lg shadow-sm overflow-hidden">
            <Table
              loadingTableContent={loading}
              data={articles}
              language={language}
              pageSize={10}
              onRowClick={(article) => openEditForm(article)}
              noRecordText={language === 'en' ? 'No articles written yet' : 'کوئی مضمون نہیں لکھا گیا'}
              tableLayout={[
                {
                  headData: language === 'en' ? 'Title' : 'عنوان',
                  bodyData: (article) => <span className={`font-bold font-serif max-w-xs truncate ${language === 'ur' ? 'text-right' : 'text-left'}`}>{article.title}</span>,
                  tdClassName: language === 'ur' ? 'text-right' : 'text-left'
                },
                {
                  headData: language === 'en' ? 'Category' : 'زمرہ',
                  bodyData: (article) => (
                    <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded">
                      {language === 'en' ? article.category : (ARTICLE_TRANSLATIONS[article.category] || article.category)}
                    </span>
                  ),
                  tdClassName: language === 'ur' ? 'text-right' : 'text-left'
                },
                {
                  headData: language === 'en' ? 'Publish Date' : 'اشاعت کی تاریخ',
                  bodyData: (article) => (
                    <span className={`font-light text-xs ${language === 'ur' ? 'text-right' : 'text-left'}`}>
                      {new Date(article.publishDate).toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-US')}
                    </span>
                  ),
                  tdClassName: language === 'ur' ? 'text-right' : 'text-left'
                },
                {
                  headData: language === 'en' ? 'Views' : 'مشاہدات',
                  bodyData: (article) => (
                    <span className="font-semibold text-xs text-accent">
                      {article.viewCount || 0}
                    </span>
                  ),
                  tdClassName: "text-center"
                },
                {
                  headData: language === 'en' ? 'Actions' : 'اقدامات',
                  bodyData: (article) => (
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditForm(article);
                        }}
                        className="p-1.5 text-accent hover:bg-amber-50 rounded transition-colors"
                        title={language === 'en' ? 'Edit Article' : 'مضمون کی تدوین کریں'}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(article._id);
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title={language === 'en' ? 'Delete Article' : 'مضمون حذف کریں'}
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
        title={language === 'en' ? 'Delete Article' : 'مضمون حذف کرنے کی تصدیق'}
        message={language === 'en' ? 'Are you sure you want to delete this article?' : 'کیا آپ واقعی اس مضمون کو حذف کرنا چاہتے ہیں؟'}
        type="danger"
        confirmText={language === 'en' ? 'Delete' : 'ہاں، حذف کریں'}
        cancelText={language === 'en' ? 'Cancel' : 'منسوخ کریں'}
      />
    </div>
  );
}

