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
  BookOpen
} from 'lucide-react';
import { getFatwas, createFatwa, updateFatwa, deleteFatwa } from '@/services';
import RichTextEditor from '../../../components/RichTextEditor/RichTextEditor';
import { Table, ConfirmationBox } from '@/components';
import { FATWA_CATEGORIES, FATWA_TRANSLATIONS } from '@/utils/categories';

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
    category: 'Salah',
    question: '',
    detailedAnswer: '',
    references: '',
  });

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
      const list = data.fatwas || (Array.isArray(data) ? data : []);
      setFatwas(list);
      setPages(data.pages || Math.ceil((data.total || list.length) / limit) || 1);
      setPage(data.page || pageNum);
      setTotal(data.total !== undefined ? data.total : list.length);
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

  const handleEditorChange = (htmlContent) => {
    setFormFields((prev) => ({ ...prev, detailedAnswer: htmlContent }));
  };

  const openCreateForm = () => {
    setActionError(null);
    setEditingId(null);
    setFormFields({
      title: '',
      category: 'Salah',
      question: '',
      detailedAnswer: '',
      references: '',
    });
    setIsFormOpen(true);
    setSuccess(false);
  };

  const openEditForm = (fatwa) => {
    setActionError(null);
    setEditingId(fatwa._id);
    setFormFields({
      title: fatwa.title || '',
      category: fatwa.category || 'Salah',
      question: fatwa.question || '',
      detailedAnswer: fatwa.detailedAnswer || '',
      references: fatwa.references ? fatwa.references.join('\n') : '',
    });
    setIsFormOpen(true);
    setSuccess(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setActionError(null);
    setActionLoading(true);

    const payload = {
      ...formFields,
      references: formFields.references
        .split('\n')
        .map((r) => r.trim())
        .filter((r) => r),
    };

    try {
      if (editingId) {
        await updateFatwa(editingId, payload);
        showSuccess('فتویٰ کامیابی کے ساتھ اپ ڈیٹ ہو گیا۔');
      } else {
        await createFatwa(payload);
        showSuccess('نیا فتویٰ کامیابی کے ساتھ شائع ہو گیا۔');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || 'فتویٰ محفوظ نہیں ہو سکا');
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
      setActionError(err.response?.data?.message || err.message || 'فتویٰ حذف نہیں ہو سکا');
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
      className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans text-right"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Module Header */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/admin/dashboard"
              className="p-2 border-2 border-gray-300 bg-slate-50 hover:bg-slate-100 rounded text-slate-600 transition-colors shrink-0"
              title="ڈیش بورڈ واپس"
            >
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="flex flex-col gap-1.5">
              <h1 className="text-xl sm:text-2xl font-bold text-primary font-serif leading-normal">
                فتاویٰ و احکام کا انتظام
              </h1>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                دار الافتاء کے تصدیق شدہ فتاویٰ شائع کریں، تدوین کریں اور تلاش کریں۔
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded border border-primary/20 shrink-0">
              مجموعی فتاویٰ: {total}
            </span>
            {!isFormOpen && (
              <button
                onClick={openCreateForm}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded text-xs font-bold shadow-sm transition-all border-2 border-primary/80 shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-accent" />
                <span>نیا فتویٰ شامل کریں</span>
              </button>
            )}
          </div>
        </div>

        {/* Action success alert banner */}
        {success && (
          <div className="bg-emerald-50 border-2 border-emerald-500 text-emerald-800 p-4 rounded-lg flex items-center gap-3 shadow-sm text-right">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs sm:text-sm font-bold">{successMsg}</span>
          </div>
        )}

        {/* Form vs List View */}
        {isFormOpen ? (
          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-md overflow-hidden">
            <div className="bg-primary text-white px-6 py-4 border-b-2 border-accent/40 flex items-center justify-between">
              <h2 className="font-bold text-sm sm:text-base font-serif flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-accent" />
                <span>
                  {editingId ? 'فتویٰ کی تدوین کریں' : 'نیا شرعی فتویٰ شامل کریں'}
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
                <div className="bg-red-50 border-2 border-red-400 text-red-700 p-3.5 rounded text-xs flex items-center gap-2.5 text-right">
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
                    className="w-full border-2 border-gray-300 rounded p-2.5 text-xs outline-none focus:border-primary transition-colors text-right"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    زمرہ *
                  </label>
                  <select
                    name="category"
                    value={formFields.category}
                    onChange={handleInputChange}
                    required
                    className="w-full border-2 border-gray-300 rounded p-2.5 text-xs outline-none bg-white text-slate-700 focus:border-primary text-right"
                    dir="rtl"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.labelUr}
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
                  className="w-full border-2 border-gray-300 rounded-lg p-3 text-xs outline-none focus:border-primary transition-colors resize-y text-right"
                  dir="rtl"
                ></textarea>
              </div>

              {/* Detailed Answer Editor */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  شرعی فتویٰ و تفصیلی جواب (رچ ایڈیٹر) *
                </label>
                <RichTextEditor
                  value={formFields.detailedAnswer}
                  onChange={handleEditorChange}
                  placeholder="الجواب وباللہ التوفیق: باضابطہ شرعی جواب اور فیصلہ یہاں تحریر کریں..."
                />
              </div>

              {/* References */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  حوالہ جات / مراجع (ہر لائن میں ایک)
                </label>
                <textarea
                  name="references"
                  value={formFields.references}
                  onChange={handleInputChange}
                  placeholder="مثال: فتح الباری از ابن حجر، ج: 4، ص: 120&#10;الفتاویٰ الہندیہ، کتاب البیوع"
                  rows={3}
                  className="w-full border-2 border-gray-300 rounded-lg p-3 text-xs outline-none focus:border-primary transition-colors resize-y text-right"
                  dir="rtl"
                ></textarea>
              </div>

              {/* Form Action Controls */}
              <div className="pt-4 border-t-2 border-gray-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border-2 border-gray-300 text-slate-600 rounded text-xs font-bold hover:bg-slate-50 transition-colors uppercase tracking-wider"
                >
                  منسوخ کریں
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex items-center gap-1.5 px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded text-xs font-bold shadow-sm transition-all uppercase tracking-wider disabled:opacity-50 border-2 border-primary/70 cursor-pointer"
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
            <div className="bg-white border-2 border-gray-300 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
              <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="فتاویٰ تلاش کریں..."
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

            {/* Main Table with Integrated Pagination & Row Click */}
            <div className="bg-white border-2 border-gray-300 rounded-lg shadow-md overflow-hidden">
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
                        <span className="font-bold font-serif text-xs text-slate-900 line-clamp-1 block">
                          {fatwa.title}
                        </span>
                        {fatwa.question && (
                          <span className="text-[11px] text-slate-500 line-clamp-1 block font-light mt-0.5">
                            {fatwa.question}
                          </span>
                        )}
                      </div>
                    ),
                    tdClassName: 'border-b border-gray-200 py-3 text-right',
                  },
                  {
                    headData: 'زمرہ',
                    bodyData: (fatwa) => (
                      <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded border border-primary/20 whitespace-nowrap">
                        {FATWA_TRANSLATIONS[fatwa.category] || fatwa.category || 'عام'}
                      </span>
                    ),
                    tdClassName: 'border-b border-gray-200 py-3 text-right',
                  },
                  {
                    headData: 'اشاعت کی تاریخ',
                    bodyData: (fatwa) => (
                      <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
                        {fatwa.publishDate
                          ? new Date(fatwa.publishDate).toLocaleDateString('ur-PK')
                          : '—'}
                      </span>
                    ),
                    tdClassName: 'border-b border-gray-200 py-3 text-right',
                  },
                  {
                    headData: 'مشاہدات',
                    bodyData: (fatwa) => (
                      <span className="font-bold text-xs text-accent">
                        {fatwa.viewCount || 0}
                      </span>
                    ),
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
                          className="p-1.5 text-accent hover:bg-amber-50 rounded transition-colors border border-transparent hover:border-amber-300"
                          title="ترمیم کریں"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(fatwa._id);
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors border border-transparent hover:border-red-300"
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

