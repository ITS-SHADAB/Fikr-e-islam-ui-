import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ArrowRight, Save, AlertTriangle, Book, CheckCircle, Eye, Search } from 'lucide-react';
import { getPublications, createPublication, updatePublication, deletePublication } from '@/services';
import { useSettings } from '@/hooks/useSettings';
import { Input, PdfViewer, Table, ConfirmationBox } from '@/components';
import { BACKEND_URL } from '@/constants/urls';


import { CATEGORY_MAP, PUBLICATION_TRANSLATIONS, BOOK_LANGUAGE_TRANSLATIONS } from '@/utils/categories';

const BOOK_LANGUAGES = [
  { value: 'ur', labelUr: 'اردو', labelEn: 'Urdu' },
  { value: 'ar', labelUr: 'عربی', labelEn: 'Arabic' },
  { value: 'en', labelUr: 'انگریزی', labelEn: 'English' },
];

export default function ManagePublications() {
  const { settings } = useSettings();
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';


  const [publications, setPublications] = useState([]);
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
    blanguage: 'ur',
    author: 'مفتی فیضان سرور مصباحی',
    pageCount: '',
    tags: '',
    references: '',
  });
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [existingPdfUrl, setExistingPdfUrl] = useState(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState(null);
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

  const categories = CATEGORY_MAP.publications;

  const loadPublications = async (pageNum = page, category = selectedCategory, search = searchTerm) => {
    try {
      setLoading(true);
      const data = await getPublications({ page: pageNum, limit, category, search });
      setPublications(data.books || (Array.isArray(data) ? data : []));
      setPages(data.pages || 1);
      setPage(data.page || 1);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to load publications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPublications(page, selectedCategory, searchTerm);
  }, [page, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadPublications(1, selectedCategory, searchTerm);
  };

  const handleCategoryFilter = (cat) => {
    setSelectedCategory(cat);
    setPage(1);
    loadPublications(1, cat, searchTerm);
  };

  const handlePageChange = (pageNum) => {
    setPage(pageNum);
    loadPublications(pageNum, selectedCategory, searchTerm);
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
      blanguage: 'ur',
      author: 'مفتی فیضان سرور مصباحی',
      pageCount: '',
      tags: '',
      references: '',
    });
    setCoverImageFile(null);
    setPdfFile(null);
    setExistingPdfUrl(null);
    setExistingCoverUrl(null);
    setPreviewUrl(null);
    setIsPreviewOpen(false);
    setIsFormOpen(true);
    setSuccess(false);
  };

  const openEditForm = (pub) => {
    setActionError(null);
    setEditingId(pub._id);

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

    const pdfUrl = pub.pdf?.url || (typeof pub.pdf === 'string' ? pub.pdf : null);
    const coverUrl = pub.coverImage?.url || (typeof pub.coverImage === 'string' ? pub.coverImage : null);

    setFormFields({
      title: pub.title,
      summary: pub.summary,
      category: categoryMap[pub.category] || pub.category,
      blanguage: pub.blanguage || 'ur',
      author: pub.author,
      pageCount: pub.pageCount || '',
      tags: pub.tags ? pub.tags.join(', ') : '',
      references: pub.references ? pub.references.join(', ') : '',
    });
    setCoverImageFile(null);
    setPdfFile(null);
    setExistingPdfUrl(pdfUrl);
    setExistingCoverUrl(coverUrl);
    setPreviewUrl(null);
    setIsPreviewOpen(false);
    setIsFormOpen(true);
    setSuccess(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setActionError(null);
    setActionLoading(true);

    if (!editingId && !coverImageFile) {
      setActionError(language === 'en' ? 'Cover Image file is required' : 'سرورق تصویر کی فائل درکار ہے');
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
    formData.append('blanguage', formFields.blanguage);
    formData.append('author', formFields.author);
    if (formFields.pageCount) {
      formData.append('pageCount', formFields.pageCount);
    }
    formData.append('tags', formFields.tags);
    formData.append('references', formFields.references);

    if (coverImageFile) {
      formData.append('coverImage', coverImageFile);
    }
    if (pdfFile) {
      formData.append('pdf', pdfFile);
    }

    try {
      if (editingId) {
        await updatePublication(editingId, formData);
        showSuccess(language === 'en' ? 'Publication updated successfully.' : 'مطبوعہ کامیابی سے اپ ڈیٹ ہو گئی۔');
      } else {
        await createPublication(formData);
        showSuccess(language === 'en' ? 'Publication added successfully.' : 'مطبوعہ کامیابی سے شامل ہو گئی۔');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || 'Failed to save publication');
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
      await deletePublication(id);
      showSuccess(language === 'en' ? 'Publication deleted successfully.' : 'مطبوعہ کامیابی سے حذف کر دی گئی۔');
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || 'Failed to delete publication');
    } finally {
      setDeleteTargetId(null);
    }
  };



  const showSuccess = (msg) => {
    setSuccess(true);
    setSuccessMsg(msg);
    setIsFormOpen(false);
    setEditingId(null);
    loadPublications();
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="bg-background py-10 min-h-[80vh] text-right" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Module Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-gray-300 pb-5 text-right">
          <div className="flex items-center gap-3">
            <Link to="/admin/dashboard" className="p-2 border-2 border-gray-300 bg-white rounded text-slate-600 hover:text-accent hover:border-accent shrink-0 transition-colors">
              <ArrowRight className="w-4.5 h-4.5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-primary font-serif">مطبوعات و کتب کا انتظام</h1>
            </div>
          </div>

          {!isFormOpen && (
            <button
              onClick={openCreateForm}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded text-xs font-bold shadow-sm transition-all uppercase tracking-wider font-serif border-2 border-primary/60"
            >
              <Plus className="w-4 h-4 text-accent" />
              مطبوعہ شامل کریں
            </button>
          )}
        </div>

        {/* Success alert */}
        {success && (
          <div className={`bg-emerald-50 border-r-4 border-emerald-500 p-4 flex items-start gap-2.5 text-emerald-800 text-xs shadow-sm border-2 border-emerald-200 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
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
                  ? (language === 'en' ? 'Edit Publication Details' : 'مطبوعہ کی تفصیلات میں ترمیم کریں')
                  : (language === 'en' ? 'Add New Google Drive Publication' : 'گوگل ڈرائیو کی نئی مطبوعہ شامل کریں')
                }
              </h2>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-xs text-secondary hover:text-white underline font-light border-b border-transparent hover:border-white transition-colors"
              >
                {language === 'en' ? 'Cancel' : 'منسوخ کریں'}
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-5">

              {/* Alert error */}
              {actionError && (
                <div className={`bg-red-50 border-r-4 border-red-500 p-4 flex items-start gap-2 text-red-700 text-xs border-2 border-red-200 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
                  <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              {/* Title & Author */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 tracking-wider">{language === 'en' ? 'Publication Title *' : 'مطبوعہ کا عنوان *'}</label>
                  <Input
                    type="text"
                    name="title"
                    value={formFields.title}
                    onChange={handleInputChange}
                    required
                    placeholder={language === 'en' ? 'e.g. Guidance on Principles of Fiqh' : 'مثال: اصول فقہ کی رہنمائی'}
                    inputClassName={`w-full px-3 py-2 text-sm bg-white border-2 border-gray-300 rounded-md outline-none focus:border-primary focus:bg-white transition-colors ${language === 'ur' ? 'text-right' : 'text-left'}`}
                    border=""
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 tracking-wider">{language === 'en' ? 'Author Name *' : 'مصنف کا نام *'}</label>
                  <Input
                    type="text"
                    name="author"
                    value={formFields.author}
                    onChange={handleInputChange}
                    required
                    placeholder={language === 'en' ? 'e.g. Mufti Sahib / Dr. Scholar' : 'مثال: مفتی صاحب / ڈاکٹر صاحب'}
                    inputClassName={`w-full px-3 py-2 text-sm bg-white border-2 border-gray-300 rounded-md outline-none focus:border-primary focus:bg-white transition-colors ${language === 'ur' ? 'text-right' : 'text-left'}`}
                    border=""
                  />
                </div>
              </div>

              {/* Category & Language */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 tracking-wider">{language === 'en' ? 'Category *' : 'زمرہ *'}</label>
                  <select
                    name="category"
                    value={formFields.category}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2.5 text-sm bg-white border-2 border-gray-300 rounded-md outline-none text-slate-700 focus:border-primary transition-colors ${language === 'ur' ? 'text-right' : 'text-left'}`}
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {language === 'en' ? cat.labelEn : cat.labelUr}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 tracking-wider">{language === 'en' ? 'Language *' : 'زبان *'}</label>
                  <select
                    name="blanguage"
                    value={formFields.blanguage}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2.5 text-sm bg-white border-2 border-gray-300 rounded-md outline-none text-slate-700 focus:border-primary transition-colors ${language === 'ur' ? 'text-right' : 'text-left'}`}
                  >
                    {BOOK_LANGUAGES.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {language === 'en' ? lang.labelEn : lang.labelUr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cover Image File & PDF File */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 tracking-wider">
                    {language === 'en' ? 'Cover Image (JPEG/PNG)' : 'کتاب کا سرورق'} {!editingId && ' *'}
                  </label>
                  {coverImageFile ? (
                    <div className="flex flex-col gap-2 p-3 bg-slate-50 border-2 border-dashed border-accent/60 rounded-md">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700 truncate max-w-[150px]" title={coverImageFile.name}>{coverImageFile.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({(coverImageFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const url = URL.createObjectURL(coverImageFile);
                            setPreviewUrl(url);
                            setPreviewType('image');
                            setPreviewTitle(formFields.title || 'Cover Image Preview');
                            setIsPreviewOpen(true);
                          }}
                          className="flex-grow py-1.5 px-3 bg-primary text-white text-[11px] font-bold rounded hover:opacity-90 flex items-center justify-center gap-1 cursor-pointer border-2 border-primary/60"
                        >
                          <Eye className="w-3.5 h-3.5 text-accent" />
                          {language === 'en' ? 'Preview' : 'پیش نظارہ'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setCoverImageFile(null)}
                          className="py-1.5 px-3 bg-red-50 text-red-700 hover:bg-red-100 text-[11px] font-bold rounded flex items-center justify-center gap-1 cursor-pointer border-2 border-red-300"
                        >
                          {language === 'en' ? 'Remove' : 'حذف کریں'}
                        </button>
                      </div>
                    </div>
                  ) : existingCoverUrl ? (
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCoverImageFile(e.target.files[0])}
                        className={`w-full px-3 py-1.5 text-xs bg-white border-2 border-gray-300 rounded-md outline-none focus:border-primary transition-colors ${language === 'ur' ? 'text-right' : 'text-left'}`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrl(existingCoverUrl);
                          setPreviewType('image');
                          setPreviewTitle(formFields.title || 'Current Cover');
                          setIsPreviewOpen(true);
                        }}
                        className="py-1.5 px-3 bg-secondary hover:bg-secondary/80 text-primary text-[11px] font-bold rounded flex items-center justify-center gap-1 cursor-pointer border-2 border-gray-300 hover:border-accent transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-accent" />
                        {language === 'en' ? 'View Current Cover' : 'موجودہ سرورق دیکھیں'}
                      </button>
                    </div>
                  ) : (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCoverImageFile(e.target.files[0])}
                      required={!editingId}
                      className={`w-full px-3 py-2 text-xs bg-white border-2 border-gray-300 rounded-md outline-none focus:border-primary transition-colors ${language === 'ur' ? 'text-right' : 'text-left'}`}
                    />
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 tracking-wider">
                    {language === 'en' ? 'PDF Document' : 'پی ڈی ایف کتاب'} {!editingId && ' *'}
                  </label>
                  {pdfFile ? (
                    <div className="flex flex-col gap-2 p-3 bg-slate-50 border-2 border-dashed border-accent/60 rounded-md">
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
                          className="flex-grow py-1.5 px-3 bg-primary text-white text-[11px] font-bold rounded hover:opacity-90 flex items-center justify-center gap-1 cursor-pointer border-2 border-primary/60"
                        >
                          <Eye className="w-3.5 h-3.5 text-accent" />
                          {language === 'en' ? 'Preview' : 'پیش نظارہ'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setPdfFile(null)}
                          className="py-1.5 px-3 bg-red-50 text-red-700 hover:bg-red-100 text-[11px] font-bold rounded flex items-center justify-center gap-1 cursor-pointer border-2 border-red-300"
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
                        className={`w-full px-3 py-1.5 text-xs bg-white border-2 border-gray-300 rounded-md outline-none focus:border-primary transition-colors ${language === 'ur' ? 'text-right' : 'text-left'}`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrl(existingPdfUrl);
                          setPreviewType('pdf');
                          setPreviewTitle(formFields.title || 'Current PDF');
                          setIsPreviewOpen(true);
                        }}
                        className="py-1.5 px-3 bg-secondary hover:bg-secondary/80 text-primary text-[11px] font-bold rounded flex items-center justify-center gap-1 cursor-pointer border-2 border-gray-300 hover:border-accent transition-colors"
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
                      className={`w-full px-3 py-2 text-xs bg-white border-2 border-gray-300 rounded-md outline-none focus:border-primary transition-colors ${language === 'ur' ? 'text-right' : 'text-left'}`}
                    />
                  )}
                </div>
              </div>

              {/* Page Count & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 tracking-wider">{language === 'en' ? 'Page Count' : 'صفحات کی تعداد'}</label>
                  <Input
                    type="number"
                    name="pageCount"
                    value={formFields.pageCount}
                    onChange={handleInputChange}
                    min="1"
                    placeholder={language === 'en' ? 'e.g. 150' : 'مثال: 150'}
                    inputClassName={`w-full px-3 py-2 text-sm bg-white border-2 border-gray-300 rounded-md outline-none focus:border-primary focus:bg-white transition-colors ${language === 'ur' ? 'text-right' : 'text-left'}`}
                    border=""
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 tracking-wider">{language === 'en' ? 'Tags (separated by comma)' : 'ٹیگز (کوما سے الگ کریں)'}</label>
                  <Input
                    type="text"
                    name="tags"
                    value={formFields.tags}
                    onChange={handleInputChange}
                    placeholder={language === 'en' ? 'e.g. Aqeedah, Tauheed' : 'مثال: عقائد، توحید'}
                    inputClassName={`w-full px-3 py-2 text-sm bg-white border-2 border-gray-300 rounded-md outline-none focus:border-primary focus:bg-white transition-colors ${language === 'ur' ? 'text-right' : 'text-left'}`}
                    border=""
                  />
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 tracking-wider">{language === 'en' ? 'Short Summary *' : 'مختصر خلاصہ *'}</label>
                <textarea
                  name="summary"
                  value={formFields.summary}
                  onChange={handleInputChange}
                  required
                  placeholder={language === 'en' ? 'Provide a brief overview of this book...' : 'اس کتاب کا مختصر جائزہ فراہم کریں...'}
                  rows={3}
                  className={`w-full px-3 py-2 text-sm bg-white border-2 border-gray-300 rounded-md outline-none focus:border-primary focus:bg-white transition-colors resize-y ${language === 'ur' ? 'text-right' : 'text-left'}`}
                ></textarea>
              </div>

              {/* References */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 tracking-wider">{language === 'en' ? 'References / Sources (separated by comma)' : 'حوالہ جات / مراجع (کوما سے الگ کریں)'}</label>
                <textarea
                  name="references"
                  value={formFields.references}
                  onChange={handleInputChange}
                  placeholder={language === 'en' ? 'e.g. Fath al-Bari, Hadith No. 123' : 'مثال: فتح الباری، حدیث نمبر 123'}
                  rows={2}
                  className={`w-full px-3 py-2 text-sm bg-white border-2 border-gray-300 rounded-md outline-none focus:border-primary focus:bg-white transition-colors resize-y ${language === 'ur' ? 'text-right' : 'text-left'}`}
                ></textarea>
              </div>

              {/* Action operations */}
              <div className="pt-5 border-t-2 border-gray-200 flex items-center justify-start gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 border-2 border-gray-400 text-slate-700 rounded text-xs font-bold hover:bg-slate-50 transition-colors uppercase tracking-wider font-serif"
                >
                  {language === 'en' ? 'Cancel' : 'منسوخ کریں'}
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded text-xs font-bold shadow-sm transition-all uppercase tracking-wider font-serif disabled:opacity-50 border-2 border-primary/60"
                >
                  <Save className="w-4 h-4 text-accent" />
                  {actionLoading ? (language === 'en' ? 'Saving...' : 'محفوظ کیا جا رہا ہے...') : (language === 'en' ? 'Save Book' : 'کتاب محفوظ کریں')}
                </button>
              </div>

            </form>
          </div>
        ) : (
          /* Publications List Table with Toolbar and Pagination */
          <div className="space-y-4">
            {/* Search & Filter Toolbar */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
              <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="مطبوعات تلاش کریں..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-primary transition-colors pr-8 pl-3 text-right"
                  dir="rtl"
                />
                <button
                  type="submit"
                  className="absolute top-2 text-slate-400 hover:text-primary right-2.5"
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
                data={publications}
                noRecordText="کوئی مطبوعہ درج نہیں ہے"
                currentPage={page}
                totalPages={pages}
                totalItems={total}
                pageSize={limit}
                onPageChange={handlePageChange}
                onRowClick={(pub) => openEditForm(pub)}
                language="ur"
                tableLayout={[
                  {
                    headData: 'غلاف',
                    bodyData: (pub) => {
                      const imgSrc = pub.coverImage?.url || (typeof pub.coverImage === 'string' ? pub.coverImage : null);
                      const finalUrl = imgSrc ? (imgSrc.startsWith('/') ? `${BACKEND_URL}${imgSrc}` : imgSrc) : null;
                      return (
                        <div className="w-10 h-14 rounded overflow-hidden shadow-sm border border-gray-200 bg-slate-100 flex items-center justify-center shrink-0 mx-auto">
                          {finalUrl ? (
                            <img
                              src={finalUrl}
                              alt={pub.title}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          ) : (
                            <Book className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      );
                    },
                    tdClassName: "border-b border-gray-200 py-2.5 text-center w-14 shrink-0"
                  },
                  {
                    headData: 'عنوان',
                    bodyData: (pub) => <span className="font-bold font-serif max-w-xs truncate block text-right">{pub.title}</span>,
                    tdClassName: "border-b border-gray-200 py-3 text-right"
                  },
                  {
                    headData: 'مصنف',
                    bodyData: (pub) => <span className="font-light text-xs text-right">{pub.author}</span>,
                    tdClassName: "border-b border-gray-200 py-3 text-right"
                  },
                  {
                    headData: 'زمرہ',
                    bodyData: (pub) => (
                      <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded border border-primary/20">
                        {PUBLICATION_TRANSLATIONS[pub.category] || pub.category}
                      </span>
                    ),
                    tdClassName: "border-b border-gray-200 py-3 text-right"
                  },
                  {
                    headData: 'زبان',
                    bodyData: (pub) => (
                      <span className="text-xs font-semibold text-slate-500 text-right">
                        {BOOK_LANGUAGE_TRANSLATIONS[pub.blanguage] || pub.blanguage}
                      </span>
                    ),
                    tdClassName: "border-b border-gray-200 py-3 text-right"
                  },
                  {
                    headData: 'اقدامات',
                    bodyData: (pub) => (
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditForm(pub);
                          }}
                          className="p-1.5 text-accent hover:bg-amber-50 rounded transition-colors border border-transparent hover:border-amber-300"
                          title="ترمیم کریں"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(pub._id);
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors border border-transparent hover:border-red-300"
                          title="حذف کریں"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ),
                    tdClassName: "border-b border-gray-200 py-3 text-left"
                  }
                ]}
                theadClassName="border-b-2 border-gray-300 bg-primary"
                thClassName="px-4 py-3 text-xs font-bold text-white uppercase tracking-wider border-b-2 border-gray-300"
              />
            </div>
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

      {/* Delete Publication Confirmation Box */}
      <ConfirmationBox
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteTargetId(null);
        }}
        onConfirm={handleConfirmDelete}
        title={language === 'en' ? 'Delete Publication' : 'مطبوعہ حذف کرنے کی تصدیق'}
        message={language === 'en' ? 'Are you sure you want to delete this publication?' : 'کیا آپ واقعی اس مطبوعہ کو حذف کرنا چاہتے ہیں؟'}
        type="danger"
        confirmText={language === 'en' ? 'Delete' : 'ہاں، حذف کریں'}
        cancelText={language === 'en' ? 'Cancel' : 'منسوخ کریں'}
      />
    </div>
  );
}