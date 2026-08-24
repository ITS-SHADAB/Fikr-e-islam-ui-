import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Save, Trash2, Edit2, CheckCircle, AlertTriangle, User, Search, Shield, X, HelpCircle } from 'lucide-react';
import { getAdminUsers, updateUser, deleteUser } from '@/services';
import { useSettings } from '@/hooks/useSettings';
import { Input, ImageViewer, Table, ConfirmationBox } from '@/components';
import { COLORS } from '@/utils/themeColors';



const TRANSLATIONS = {
  en: {
    title: "Manage Users",
    subTitle: "View, update, or deactivate administrator and scholar accounts.",
    searchPlaceholder: "Search by name, email or login phone...",
    allRoles: "All Roles",
    allStatus: "All Status",
    active: "Active",
    inactive: "Inactive",
    name: "Name",
    email: "Login Email",
    loginPhone: "Login Phone",
    contactPhone: "Contact Phone",
    role: "Role",
    status: "Status",
    lastLogin: "Last Login",
    actions: "Actions",
    editUser: "Edit User Info",
    updateUser: "Update User",
    deleteConfirm: "Are you sure you want to deactivate this user? Deactivated users will not be able to log in.",
    save: "Save Changes",
    cancel: "Cancel",
    successUpdate: "User details updated successfully.",
    successDelete: "User deactivated successfully.",
    loading: "Loading users data...",
    noUsers: "No users found matching the filter criteria.",
    never: "Never logged in",
    admin: "Admin",
    editor: "Editor",
    mufti: "Mufti",
    user: "User",
    prev: "Previous",
    next: "Next",
    page: "Page"
  },
  ur: {
    title: "صارفین کا انتظام",
    subTitle: "انتظامیہ اور علماء کے اکاؤنٹس دیکھیں، تبدیل کریں یا غیر فعال کریں۔",
    searchPlaceholder: "نام، ای میل یا فون سے تلاش کریں...",
    allRoles: "تمام کردار",
    allStatus: "تمام صورتحال",
    active: "فعال",
    inactive: "غیر فعال",
    name: "نام",
    email: "لاگ ان ای میل",
    loginPhone: "لاگ ان فون",
    contactPhone: "رابطہ نمبر",
    role: "کردار",
    status: "حیثیت",
    lastLogin: "آخری لاگ ان",
    actions: "اقدامات",
    editUser: "صارف کی معلومات میں ترمیم",
    updateUser: "صارف کو اپ ڈیٹ کریں",
    deleteConfirm: "کیا آپ واقعی اس صارف کو غیر فعال کرنا چاہتے ہیں؟ غیر فعال صارفین لاگ ان نہیں ہو سکیں گے۔",
    save: "تبدیلیاں محفوظ کریں",
    cancel: "منسوخ کریں",
    successUpdate: "صارف کو کامیابی کے ساتھ اپ ڈیٹ کر دیا گیا۔",
    successDelete: "صارف کو کامیابی کے ساتھ غیر فعال کر دیا گیا۔",
    loading: "صارفین لوڈ ہو رہے ہیں...",
    noUsers: "معیار کے مطابق کوئی صارف نہیں ملا۔",
    never: "کبھی لاگ ان نہیں ہوئے",
    admin: "ایڈمن",
    editor: "ایڈیٹر",
    mufti: "مفتی",
    user: "صارف",
    prev: "پچھلا",
    next: "اگلا",
    page: "صفحہ"
  }
};

export default function ManageUsers() {
  const { settings } = useSettings();
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';
  const t = TRANSLATIONS[language];


  // Users and Pagination State
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Filter States
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  // Edit Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formFields, setFormFields] = useState({
    name: '',
    loginEmail: '',
    loginPhone: '',
    contactPhone: '',
    role: 'user',
    isActive: true,
  });

  // Action Status States
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    try {
      const queryParams = {
        page,
        limit: 10,
        search: search.trim() || undefined,
        role: roleFilter || undefined,
        isActive: statusFilter === '' ? undefined : statusFilter
      };

      const res = await getAdminUsers(queryParams);
      if (res.success) {
        setUsers(res.data || []);
        setPagination(res.pagination || {
          currentPage: page,
          totalPages: 1,
          totalUsers: res.data?.length || 0,
          hasNextPage: false,
          hasPrevPage: false
        });
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page, roleFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadUsers();
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormFields({
      name: user.name || '',
      loginEmail: user.loginEmail || '',
      loginPhone: user.loginPhone || '',
      contactPhone: user.contactPhone || '',
      role: user.role || 'user',
      isActive: user.isActive !== undefined ? user.isActive : true,
    });
    setActionError(null);
    setIsEditOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormFields(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setActionError(null);
    setActionLoading(true);

    // Frontend validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!formFields.name.trim()) {
      setActionError(language === 'en' ? 'Name is required' : 'نام درکار ہے');
      setActionLoading(false);
      return;
    }

    if (formFields.loginEmail && !emailRegex.test(formFields.loginEmail)) {
      setActionError(language === 'en' ? 'Invalid login email format' : 'لاگ ان ای میل کا فارمیٹ غلط ہے');
      setActionLoading(false);
      return;
    }

    if (formFields.loginPhone && !phoneRegex.test(formFields.loginPhone)) {
      setActionError(language === 'en' ? 'Invalid login phone (must be 10 digits starting with 6-9)' : 'لاگ ان فون نمبر غلط ہے (10 ہندسے اور 6-9 سے شروع ہونا چاہیے)');
      setActionLoading(false);
      return;
    }

    if (formFields.contactPhone && !phoneRegex.test(formFields.contactPhone)) {
      setActionError(language === 'en' ? 'Invalid contact phone (must be 10 digits starting with 6-9)' : 'رابطہ فون نمبر غلط ہے (10 ہندسے اور 6-9 سے شروع ہونا چاہیے)');
      setActionLoading(false);
      return;
    }

    try {
      const res = await updateUser(editingUser._id, formFields);
      if (res.success) {
        setIsEditOpen(false);
        setEditingUser(null);
        showSuccess(t.successUpdate);
      }
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || 'Failed to update user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    const id = deleteTargetId;
    setShowDeleteModal(false);
    try {
      const res = await deleteUser(id);
      if (res.success) {
        showSuccess(t.successDelete);
      }
    } catch (err) {
      setErrorModal({
        isOpen: true,
        message: err.response?.data?.message || err.message || 'Failed to deactivate user'
      });
    } finally {
      setDeleteTargetId(null);
    }
  };



  const showSuccess = (msg) => {
    setSuccess(true);
    setSuccessMsg(msg);
    loadUsers();
    setTimeout(() => setSuccess(false), 3000);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return t.never;
    return new Date(dateStr).toLocaleString(language === 'ur' ? 'ur-PK' : 'en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  return (
    <div className={`bg-background py-10 min-h-[80vh] ${language === 'ur' ? 'text-right' : 'text-left'}`} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Header Block */}
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/50 pb-5 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
          <div className="flex items-center gap-3">
            <Link to="/admin/dashboard" className="p-2 border border-border bg-white rounded text-slate-500 hover:text-accent shrink-0">
              <ArrowRight className={`w-4.5 h-4.5 ${language === 'en' ? 'rotate-180' : ''}`} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-primary font-serif">{t.title}</h1>

            </div>
          </div>
        </div>

        {/* Global Alert Notification */}
        {success && (
          <div className={`bg-emerald-50 border-r-4 border-emerald-500 p-4 flex items-start gap-2.5 text-emerald-800 text-xs shadow-xs rounded`}>
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Search and Filters Bar */}
        <div className="bg-white border border-border rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-lg flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
              />
              <Search className={`absolute w-4 h-4 text-slate-400 top-1/2 -translate-y-1/2 ${language === 'ur' ? 'left-3' : 'left-3'}`} />
            </div>
            <button
              type="submit"
              style={{ backgroundColor: COLORS.primary }}
              className="px-4 py-2 text-sm text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
            >
              {language === 'en' ? 'Search' : 'تلاش کریں'}
            </button>
          </form>

          <div className="flex gap-3">
            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              className="border border-border rounded-lg text-sm px-3 py-2 bg-white focus:outline-none focus:border-accent"
            >
              <option value="">{t.allRoles}</option>
              <option value="admin">{t.admin}</option>
              <option value="editor">{t.editor}</option>
              <option value="mufti">{t.mufti}</option>
              <option value="user">{t.user}</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="border border-border rounded-lg text-sm px-3 py-2 bg-white focus:outline-none focus:border-accent"
            >
              <option value="">{t.allStatus}</option>
              <option value="true">{t.active}</option>
              <option value="false">{t.inactive}</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
          <Table
            loadingTableContent={loading}
            data={users}
            language={language}
            pageSize={10}
            noRecordText={t.noUsers}
            tableLayout={[
              {
                headData: t.name,
                bodyData: (user) => (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 overflow-hidden shrink-0">
                      {user.profileImage?.url ? (
                        <ImageViewer
                          src={user.profileImage.url}
                          alt={user.name}
                          thumbnailSize={1}
                          thumbnailBorderRadius="rounded-full"
                          thumbnailObjectFit="cover"
                          showZoomIcon={false}
                        />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                    <span>{user.name}</span>
                  </div>
                ),
                tdClassName: "text-center font-bold text-slate-800"
              },
              {
                headData: t.email,
                bodyData: (user) => user.loginEmail || '-',
                tdClassName: "text-center font-mono text-xs"
              },
              {
                headData: t.loginPhone,
                bodyData: (user) => user.loginPhone || '-',
                tdClassName: "text-center font-mono text-xs"
              },
              {
                headData: t.contactPhone,
                bodyData: (user) => user.contactPhone || '-',
                tdClassName: "text-center font-mono text-xs"
              },
              {
                headData: t.role,
                bodyData: (user) => (
                  <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide ${user.role === 'admin' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      user.role === 'mufti' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        user.role === 'editor' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          'bg-slate-100 text-slate-600'
                    }`}>
                    {t[user.role] || user.role}
                  </span>
                ),
                tdClassName: "text-center"
              },
              {
                headData: t.status,
                bodyData: (user) => (
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${user.isActive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-red-50 text-red-700'
                    }`}>
                    {user.isActive ? t.active : t.inactive}
                  </span>
                ),
                tdClassName: "text-center"
              },
              {
                headData: t.lastLogin,
                bodyData: (user) => formatDate(user.lastLogin),
                tdClassName: "text-center text-xs text-slate-400"
              },
              {
                headData: t.actions,
                bodyData: (user) => (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => openEditModal(user)}
                      className="p-1.5 rounded border border-slate-200 text-slate-500 hover:text-accent hover:bg-slate-50 transition-all"
                      title={t.editUser}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleDeleteClick(user._id)}
                        className="p-1.5 rounded border border-red-200 text-red-500 hover:text-red-700 hover:bg-red-50 transition-all"
                        title={t.inactive}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ),
                tdClassName: "text-center"
              }
            ]}
          />
          {/* Pagination Controls */}
          {!loading && pagination.totalPages > 1 && (
            <div className="bg-slate-50 border-t border-border px-6 py-4 flex items-center justify-between">
              <button
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={!pagination.hasPrevPage}
                className="px-3 py-1.5 rounded border border-border bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t.prev}
              </button>
              <span className="text-xs text-slate-500 font-medium">
                {t.page} {pagination.currentPage} / {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(prev => Math.min(prev + 1, pagination.totalPages))}
                disabled={!pagination.hasNextPage}
                className="px-3 py-1.5 rounded border border-border bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t.next}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-border shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border bg-slate-50 flex items-center justify-between" dir={language === 'ur' ? 'rtl' : 'ltr'}>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-bold text-slate-800 font-serif">{t.editUser}</span>
              </div>
              <button
                onClick={() => setIsEditOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4" dir={language === 'ur' ? 'rtl' : 'ltr'}>
              {actionError && (
                <div className="bg-red-50 border-r-4 border-red-500 p-3 rounded flex items-start gap-2 text-red-800 text-xs">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{actionError}</span>
                </div>
              )}

              {/* Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">{t.name}</label>
                <Input
                  type="text"
                  name="name"
                  value={formFields.name}
                  onChange={handleFormChange}
                  required
                  placeholder="e.g. Mufti Muhammad"
                  inputClassName="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Login Email */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">{t.email}</label>
                  <Input
                    type="email"
                    name="loginEmail"
                    value={formFields.loginEmail}
                    onChange={handleFormChange}
                    placeholder="email@domain.com"
                    inputClassName="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
                  />
                </div>

                {/* Login Phone */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">{t.loginPhone}</label>
                  <Input
                    type="tel"
                    name="loginPhone"
                    value={formFields.loginPhone}
                    onChange={handleFormChange}
                    placeholder="e.g. 9876543210"
                    inputClassName="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Contact Phone */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">{t.contactPhone}</label>
                  <Input
                    type="tel"
                    name="contactPhone"
                    value={formFields.contactPhone}
                    onChange={handleFormChange}
                    placeholder="e.g. 9876543210"
                    inputClassName="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
                  />
                </div>

                {/* Role */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">{t.role}</label>
                  <select
                    name="role"
                    value={formFields.role}
                    onChange={handleFormChange}
                    className="w-full border border-border rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:border-accent"
                  >
                    <option value="user">{t.user}</option>
                    <option value="editor">{t.editor}</option>
                    <option value="mufti">{t.mufti}</option>
                    <option value="admin">{t.admin}</option>
                  </select>
                </div>
              </div>

              {/* Status (isActive) */}
              <div className="flex items-center gap-3 py-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formFields.isActive}
                  onChange={handleFormChange}
                  className="w-4.5 h-4.5 text-primary border-border rounded focus:ring-accent"
                />
                <label htmlFor="isActive" className="text-sm font-semibold text-slate-700">
                  {t.active} ({language === 'en' ? 'User can log in' : 'صارف لاگ ان ہو سکتا ہے'})
                </label>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors border border-border bg-white rounded-lg"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  style={{ backgroundColor: COLORS.primary }}
                  className="px-5 py-2 text-xs font-bold text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-1.5"
                >
                  {actionLoading ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-white"></div>
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Box */}
      <ConfirmationBox
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteTargetId(null);
        }}
        onConfirm={handleConfirmDelete}
        title={language === 'ur' ? 'صارف کو غیر فعال کرنے کی تصدیق' : 'Deactivate User'}
        message={t.deleteConfirm}
        type="danger"
        confirmText={language === 'ur' ? 'غیر فعال کریں' : 'Deactivate'}
        cancelText={t.cancel}
      />

      {/* Error Alert Box */}
      <ConfirmationBox
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, message: '' })}
        title={language === 'ur' ? 'خرابی' : 'Error'}
        message={errorModal.message}
        type="danger"
        confirmText={language === 'ur' ? 'ٹھیک ہے' : 'OK'}
        showCancel={false}
      />
    </div>
  );
}

