import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  ArrowRight,
  Save,
  AlertTriangle,
  CheckCircle,
  Search,
  BookOpen,
  Scale,
  FileText,
  Eye,
  Upload,
  X,
} from 'lucide-react';
import { getFatwas, createFatwa, updateFatwa, deleteFatwa } from '@/services';
import { Table, ConfirmationBox, PdfViewer } from '@/components';
import { FATWA_CATEGORIES, FATWA_TRANSLATIONS } from '@/utils/categories';
import { COLORS } from '@/utils/themeColors';

export default function ManageFatwas() {
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fatwas, setFatwas] = useState([]);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  // Pagination & Filter States
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const limit = 10;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form Fields State
  const [formFields, setFormFields] = useState({
    title: '',
    category: 'SALAH',
    question: '',
    summary: '',
    tags: '',
    references: '',
    publishDate: new Date().toISOString().split('T')[0],
  });

  // PDF File Upload States
  const [pdfFile, setPdfFile] = useState(null);
  const [existingPdfUrl, setExistingPdfUrl] = useState(null);

  // Modal PDF Preview
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewTitle, setPreviewTitle] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const categories = FATWA_CATEGORIES;

  const loadFatwas = async (
    pageNum = page,
    category = selectedCategory,
    search = searchTerm
  ) => {
    try {
      setLoading(true);
      const data = await getFatwas({
        page: pageNum,
        limit,
        category,
        search,
      });
      const list = data?.fatwas || (Array.isArray(data) ? data : []);
      setFatwas(list);
      setPages(data?.pages || 1);
      setPage(data?.page || 1);
      setTotal(data?.total || 0);
    } catch (err) {
      console.error('Failed to load fatwas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFatwas(page, selectedCategory, searchTerm);
  }, [page, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadFatwas(1, selectedCategory, searchTerm);
  };

  const handleCategoryFilter = (cat) => {
    setSelectedCategory(cat);
    setPage(1);
    loadFatwas(1, cat, searchTerm);
  };

  const handlePageChange = (pageNum) => {
    setPage(pageNum);
    loadFatwas(pageNum, selectedCategory, searchTerm);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const handlePdfChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
    }
  };

  const openCreateForm = () => {
    setActionError(null);
    setEditingId(null);
    setFormFields({
      title: '',
      category: 'SALAH',
      question: '',
      summary: '',
      tags: '',
      references: '',
      publishDate: new Date().toISOString().split('T')[0],
    });
    setPdfFile(null);
    setExistingPdfUrl(null);
    setIsFormOpen(true);
    setSuccess(false);
  };

  const openEditForm = (fatwa) => {
    setActionError(null);
    setEditingId(fatwa?._id);

    const pdfUrl =
      fatwa?.pdf?.url ||
      (typeof fatwa?.pdf === 'string' ? fatwa?.pdf : null);

    setFormFields({
      title: fatwa?.title || '',
      category: fatwa?.category || 'SALAH',
      question: fatwa?.question || '',
      summary: fatwa?.summary || '',
      tags: fatwa?.tags ? fatwa?.tags?.join(', ') : '',
      references: fatwa?.references ? fatwa?.references?.join('\n') : '',
      publishDate: fatwa?.publishDate
        ? new Date(fatwa?.publishDate).toISOString().split('T')[0]
        : '',
    });
    setPdfFile(null);
    setExistingPdfUrl(pdfUrl);
    setIsFormOpen(true);
    setSuccess(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setActionError(null);
    setActionLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', formFields.title);
      formData.append('category', formFields.category);
      formData.append('question', formFields.question);
      formData.append('summary', formFields.summary);
      formData.append('tags', formFields.tags);
      formData.append(
        'references',
        formFields.references
          .split('\n')
          .map((r) => r.trim())
          .filter(Boolean)
          .join(',')
      );
      if (formFields.publishDate) {
        formData.append('publishDate', formFields.publishDate);
      }
      if (pdfFile) {
        formData.append('pdf', pdfFile);
      }

      if (editingId) {
        await updateFatwa(editingId, formData);
        showSuccess('فتویٰ کامیابی کے ساتھ اپ ڈیٹ ہو گیا۔');
      } else {
        await createFatwa(formData);
        showSuccess('نیا فتویٰ کامیابی کے ساتھ شائع ہو گیا۔');
      }
    } catch (err) {
      setActionError(
        err?.response?.data?.message ||
          err?.message ||
          'فتویٰ محفوظ نہیں ہو سکا'
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
      await deleteFatwa(id);
      showSuccess('فتویٰ کامیابی کے ساتھ حذف کر دیا گیا۔');
    } catch (err) {
      setActionError(
        err?.response?.data?.message ||
          err?.message ||
          'فتویٰ حذف نہیں ہو سکا'
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
    loadFatwas(page, selectedCategory, searchTerm);
    setTimeout(() => setSuccess(false), 3500);
  };

  return (
    <div
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans text-right"
      style={{ backgroundColor: COLORS?.background }}
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Module Header */}
        <div
          className="rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm border"
          style={{
            backgroundColor: COLORS?.white,
            borderColor: COLORS?.border,
          }}
        >
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/admin/dashboard"
              className="p-2 border rounded-xl hover:bg-slate-50 transition-colors shrink-0"
              style={{
                borderColor: COLORS?.border,
                color: COLORS?.primary,
              }}
              title="ڈیش بورڈ واپس"
            >
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="flex flex-col gap-1">
              <h1
                className="text-xl sm:text-2xl font-bold font-serif leading-normal"
                style={{ color: COLORS?.primary }}
              >
                فتاویٰ و شرعی احکام کا انتظام
              </h1>
              <p
                className="text-xs font-medium"
                style={{ color: COLORS?.textSecondary }}
              >
                دار الافتاء کے مستند فتاویٰ شائع کریں، تدوین کریں اور تلاش کریں۔
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span
              className="text-xs font-bold px-3 py-1.5 rounded-xl border shrink-0"
              style={{
                backgroundColor: COLORS?.secondary,
                borderColor: COLORS?.border,
                color: COLORS?.primary,
              }}
            >
              مجموعی فتاویٰ: {total}
            </span>
            {!isFormOpen && (
              <button
                onClick={openCreateForm}
                className="flex items-center gap-1.5 px-4 py-2 text-white rounded-xl text-xs font-bold shadow-sm transition-all shrink-0 cursor-pointer"
                style={{ backgroundColor: COLORS?.primary }}
              >
                <Plus className="w-4 h-4 text-accent" />
                <span>نیا فتویٰ شامل کریں</span>
              </button>
            )}
          </div>
        </div>

        {/* Action success alert banner */}
        {success && (
          <div className="bg-emerald-50 border border-emerald-400 text-emerald-800 p-4 rounded-xl flex items-center gap-3 shadow-sm text-right">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs sm:text-sm font-bold">{successMsg}</span>
          </div>
        )}

        {/* Form vs List View */}
        {isFormOpen ? (
          <div
            className="rounded-2xl shadow-md overflow-hidden border"
            style={{
              backgroundColor: COLORS?.white,
              borderColor: COLORS?.border,
            }}
          >
            <div
              className="px-6 py-4 flex items-center justify-between text-white"
              style={{ backgroundColor: COLORS?.primary }}
            >
              <h2 className="font-bold text-sm sm:text-base font-serif flex items-center gap-2">
                <Scale className="w-4 h-4 text-accent" />
                <span>
                  {editingId
                    ? 'فتویٰ کی تدوین کریں'
                    : 'نیا شرعی فتویٰ شامل کریں'}
                </span>
              </h2>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-xs text-amber-200 hover:text-white underline font-semibold cursor-pointer"
              >
                منسوخ کریں
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
              {/* Form action errors */}
              {actionError && (
                <div className="bg-red-50 border border-red-400 text-red-700 p-3.5 rounded-xl text-xs flex items-center gap-2.5 text-right">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    فتویٰ کا عنوان / شرعی مسئلہ *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formFields.title}
                    onChange={handleInputChange}
                    required
                    placeholder="مثال: تجارتی انشورنس معاہدوں کے شرعی احکام"
                    className="w-full border rounded-xl p-2.5 text-xs outline-none focus:border-primary transition-colors text-right"
                    style={{ borderColor: COLORS?.border }}
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    فقہی زمرہ *
                  </label>
                  <select
                    name="category"
                    value={formFields.category}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded-xl p-2.5 text-xs outline-none bg-white text-slate-700 focus:border-primary text-right"
                    style={{ borderColor: COLORS?.border }}
                    dir="rtl"
                  >
                    {categories.map((cat) => (
                      <option key={cat?.value} value={cat?.value}>
                        {cat?.labelUr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* The Question Details */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  سائل کا سوال *
                </label>
                <textarea
                  name="question"
                  value={formFields.question}
                  onChange={handleInputChange}
                  required
                  placeholder="پوچھا گیا تفصیلی سوال یہاں درج کریں..."
                  rows={4}
                  className="w-full border rounded-xl p-3 text-xs outline-none focus:border-primary transition-colors resize-y text-right leading-relaxed"
                  style={{ borderColor: COLORS?.border }}
                  dir="rtl"
                />
              </div>

              {/* Detailed Answer / Summary */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  الجواب وباللہ التوفیق (شرعی فتویٰ و تفصیلی جواب) *
                </label>
                <textarea
                  name="summary"
                  value={formFields.summary}
                  onChange={handleInputChange}
                  required
                  placeholder="الجواب وباللہ التوفیق: باضابطہ شرعی جواب اور فیصلہ یہاں تحریر کریں..."
                  rows={8}
                  className="w-full border rounded-xl p-3 text-xs outline-none focus:border-primary transition-colors resize-y text-right leading-relaxed"
                  style={{ borderColor: COLORS?.border }}
                  dir="rtl"
                />
              </div>

              {/* References & Tags Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* References */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    حوالہ جات / کتب کے مراجع (ہر لائن میں ایک)
                  </label>
                  <textarea
                    name="references"
                    value={formFields.references}
                    onChange={handleInputChange}
                    placeholder="مثال: فتح الباری از ابن حجر، ج: 4، ص: 120&#10;الفتاویٰ الہندیہ، کتاب البیوع"
                    rows={4}
                    className="w-full border rounded-xl p-3 text-xs outline-none focus:border-primary transition-colors resize-y text-right"
                    style={{ borderColor: COLORS?.border }}
                    dir="rtl"
                  />
                </div>

                {/* Tags & Date */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      موضوعات و ٹیگز (کوما سے الگ کریں)
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formFields.tags}
                      onChange={handleInputChange}
                      placeholder="نماز, امامت, سجدہ سہو"
                      className="w-full border rounded-xl p-2.5 text-xs outline-none focus:border-primary transition-colors text-right"
                      style={{ borderColor: COLORS?.border }}
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      تاریخ اشاعت
                    </label>
                    <input
                      type="date"
                      name="publishDate"
                      value={formFields.publishDate}
                      onChange={handleInputChange}
                      className="w-full border rounded-xl p-2.5 text-xs outline-none focus:border-primary transition-colors text-right bg-white"
                      style={{ borderColor: COLORS?.border }}
                    />
                  </div>
                </div>
              </div>

              {/* PDF Document Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  دستخط شدہ پی ڈی ایف دستاویز (PDF Document)
                </label>
                <div
                  className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors hover:bg-slate-50"
                  style={{ borderColor: COLORS?.border }}
                >
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfChange}
                    className="hidden"
                    id="fatwa-pdf-upload"
                  />
                  <label
                    htmlFor="fatwa-pdf-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload
                      className="w-6 h-6"
                      style={{ color: COLORS?.accent }}
                    />
                    <span
                      className="text-xs font-semibold"
                      style={{ color: COLORS?.primary }}
                    >
                      {pdfFile
                        ? `منتخب شدہ: ${pdfFile.name}`
                        : existingPdfUrl
                        ? 'موجودہ PDF تبدیل کرنے کے لیے یہاں کلک کریں'
                        : 'PDF فائل اپ لوڈ کرنے کے لیے کلک کریں'}
                    </span>
                    <span
                      className="text-[11px]"
                      style={{ color: COLORS?.textSecondary }}
                    >
                      صرف PDF فائلیں قبول کی جاتی ہیں
                    </span>
                  </label>
                </div>
              </div>

              {/* Form Action Controls */}
              <div
                className="pt-4 border-t flex items-center justify-end gap-3"
                style={{ borderColor: COLORS?.border }}
              >
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
                  style={{ borderColor: COLORS?.border }}
                >
                  منسوخ کریں
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex items-center gap-1.5 px-6 py-2 text-white rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                  style={{ backgroundColor: COLORS?.primary }}
                >
                  <Save className="w-4 h-4 text-accent" />
                  {actionLoading ? 'محفوظ کیا جا رہا ہے...' : 'فتویٰ محفوظ کریں'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Fatwas List with Search Toolbar & Table */
          <div className="space-y-4">
            {/* Search & Filter Toolbar */}
            <div
              className="rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm border"
              style={{
                backgroundColor: COLORS?.white,
                borderColor: COLORS?.border,
              }}
            >
              <form
                onSubmit={handleSearchSubmit}
                className="relative w-full sm:w-80"
              >
                <input
                  type="text"
                  placeholder="فتاویٰ تلاش کریں..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2 text-xs outline-none focus:border-primary transition-colors pr-8 pl-3 text-right"
                  style={{ borderColor: COLORS?.border }}
                  dir="rtl"
                />
                <button
                  type="submit"
                  className="absolute top-2.5 text-slate-400 hover:text-primary right-2.5"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryFilter(e.target.value)}
                  className="border rounded-xl px-3 py-2 text-xs outline-none bg-white text-slate-700 focus:border-primary text-right"
                  style={{ borderColor: COLORS?.border }}
                  dir="rtl"
                >
                  <option value="">تمام فقہی زمرے</option>
                  {categories.map((cat) => (
                    <option key={cat?.value} value={cat?.value}>
                      {cat?.labelUr}
                    </option>
                  ))}
                </select>

                <span
                  className="text-xs font-semibold px-3 py-2 rounded-xl border shrink-0"
                  style={{
                    backgroundColor: COLORS?.background,
                    borderColor: COLORS?.border,
                    color: COLORS?.textSecondary,
                  }}
                >
                  مجموعی: {total}
                </span>
              </div>
            </div>

            {/* Main Table with Integrated Pagination & Row Click */}
            <div
              className="rounded-2xl shadow-md overflow-hidden border"
              style={{
                backgroundColor: COLORS?.white,
                borderColor: COLORS?.border,
              }}
            >
              <Table
                loadingTableContent={loading}
                data={fatwas}
                currentPage={page}
                totalPages={pages}
                totalItems={total}
                pageSize={limit}
                onPageChange={handlePageChange}
                onRowClick={(fatwa) => openEditForm(fatwa)}
                language="ur"
                noRecordText="کوئی فتویٰ درج نہیں ہے"
                tableLayout={[
                  {
                    headData: 'عنوان و شرعی مسئلہ',
                    bodyData: (fatwa) => (
                      <div className="max-w-md text-right">
                        <span
                          className="font-bold font-serif text-xs line-clamp-1 block"
                          style={{ color: COLORS?.primary }}
                        >
                          {fatwa?.title}
                        </span>
                        {fatwa?.question && (
                          <span
                            className="text-[11px] line-clamp-1 block font-light mt-0.5"
                            style={{ color: COLORS?.textSecondary }}
                          >
                            {fatwa?.question}
                          </span>
                        )}
                      </div>
                    ),
                    tdClassName: 'border-b border-gray-200 py-3 text-right',
                  },
                  {
                    headData: 'زمرہ',
                    bodyData: (fatwa) => (
                      <span
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full border whitespace-nowrap"
                        style={{
                          backgroundColor: `${COLORS?.primary}10`,
                          borderColor: `${COLORS?.primary}20`,
                          color: COLORS?.primary,
                        }}
                      >
                        {FATWA_TRANSLATIONS?.[fatwa?.category] ||
                          fatwa?.category ||
                          'عام'}
                      </span>
                    ),
                    tdClassName: 'border-b border-gray-200 py-3 text-right',
                  },
                  {
                    headData: 'اشاعت کی تاریخ',
                    bodyData: (fatwa) => (
                      <span className="text-[11px] font-medium whitespace-nowrap text-slate-600">
                        {fatwa?.publishDate
                          ? new Date(fatwa?.publishDate).toLocaleDateString(
                              'ur-PK'
                            )
                          : '—'}
                      </span>
                    ),
                    tdClassName: 'border-b border-gray-200 py-3 text-right',
                  },
                  {
                    headData: 'مشاہدات',
                    bodyData: (fatwa) => (
                      <span className="font-bold text-xs text-accent">
                        {fatwa?.viewCount || 0}
                      </span>
                    ),
                    tdClassName: 'border-b border-gray-200 py-3 text-center',
                  },
                  {
                    headData: 'پی ڈی ایف',
                    bodyData: (fatwa) => {
                      const pdfUrl =
                        fatwa?.pdf?.url ||
                        (typeof fatwa?.pdf === 'string' ? fatwa?.pdf : null);
                      return pdfUrl ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewUrl(pdfUrl);
                            setPreviewTitle(fatwa?.title || 'PDF Preview');
                            setIsPreviewOpen(true);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>دیکھیں</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">
                          موجود نہیں
                        </span>
                      );
                    },
                    tdClassName: 'border-b border-gray-200 py-3 text-center',
                  },
                  {
                    headData: 'اقدامات',
                    bodyData: (fatwa) => (
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditForm(fatwa);
                          }}
                          className="p-1.5 text-accent hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-300 cursor-pointer"
                          title="ترمیم کریں"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(fatwa?._id);
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-300 cursor-pointer"
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

      {/* Fullscreen PDF Viewer Modal */}
      {isPreviewOpen && previewUrl && (
        <PdfViewer
          url={previewUrl}
          title={previewTitle}
          isModal={true}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}

      {/* Delete Fatwa Confirmation Box */}
      <ConfirmationBox
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteTargetId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="فتویٰ حذف کرنے کی تصدیق"
        message="کیا آپ واقعی اس فتویٰ کو حذف کرنا چاہتے ہیں؟ یہ عمل واپس نہیں کیا جا سکتا۔"
        type="danger"
        confirmText="ہاں، حذف کریں"
        cancelText="منسوخ کریں"
      />
    </div>
  );
}
