import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  ArrowRight,
  Save,
  AlertTriangle,
  Calendar,
  Clock,
  MapPin,
  Compass,
  UploadCloud,
  Image as ImageIcon,
  CheckCircle,
  X,
  FileText,
  Info,
  Loader2,
  ExternalLink,
  ZoomIn,
  Navigation,
} from 'lucide-react';
import { getEvents, createEvent, updateEvent, deleteEvent } from '@/services';
import { useSettings } from '@/hooks/useSettings';
import { Input, Table, ConfirmationBox } from '@/components';
import { getEventPosterUrl, getGoogleMapsUrl } from '@/utils/utils';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

const formatDateForInput = (isoDateString) => {
  if (!isoDateString) return '';
  try {
    const d = new Date(isoDateString);
    if (isNaN(d.getTime())) return '';
    const pad = (n) => String(n).padStart(2, '0');
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch {
    return '';
  }
};

export default function ManageEvents() {
  const { settings } = useSettings();
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  // Events list state
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form & Action states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionLoadingText, setActionLoadingText] = useState('');
  const [actionError, setActionError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Success message state
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form Fields State
  const [formFields, setFormFields] = useState({
    title: '',
    description: '',
    eventDate: '',
    location: '',
    latitude: '',
    longitude: '',
  });

  // Poster File & Preview State
  const [posterFile, setPosterFile] = useState(null);
  const [existingPosterUrl, setExistingPosterUrl] = useState(null);
  const [posterPreviewUrl, setPosterPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewPoster, setPreviewPoster] = useState(null);
  const fileInputRef = useRef(null);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await getEvents();
      const raw = Array.isArray(data) ? data : (data.events || []);
      const map = new Map();
      raw.forEach((ev) => {
        if (ev && ev._id) map.set(ev._id, ev);
      });
      setEvents(Array.from(map.values()));
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateFile = (file) => {
    if (!file) return null;
    const extension = file.name.split('.').pop().toLowerCase();
    const isExtensionValid = ALLOWED_EXTENSIONS.includes(extension);
    const isMimeValid = ALLOWED_MIME_TYPES.includes(file.type) || isExtensionValid;

    if (!isMimeValid) {
      return language === 'en'
        ? 'Invalid file format. Only JPG, PNG, and WEBP images are allowed.'
        : 'غلط فائل فارمیٹ۔ صرف JPG، PNG اور WEBP تصاویر کی اجازت ہے۔';
    }

    if (file.size > MAX_FILE_SIZE) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      return language === 'en'
        ? `File size (${sizeMb} MB) exceeds maximum allowed size of 20 MB.`
        : `فائل کا سائز (${sizeMb} MB) زیادہ سے زیادہ 20 MB کی حد سے تجاوز کر گیا ہے۔`;
    }

    return null;
  };

  const handlePosterSelect = (file) => {
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setFieldErrors((prev) => ({ ...prev, posterImage: error }));
      setActionError(error);
      return;
    }

    // Clean up previous blob URL if any
    if (posterPreviewUrl && posterPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(posterPreviewUrl);
    }

    setFieldErrors((prev) => ({ ...prev, posterImage: null }));
    setActionError(null);
    setPosterFile(file);
    const previewUrl = URL.createObjectURL(file);
    setPosterPreviewUrl(previewUrl);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handlePosterSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handlePosterSelect(file);
    }
  };

  const handleRemovePoster = () => {
    if (posterPreviewUrl && posterPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(posterPreviewUrl);
    }
    setPosterFile(null);
    setPosterPreviewUrl(existingPosterUrl || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openCreateForm = () => {
    setActionError(null);
    setFieldErrors({});
    setEditingId(null);
    setFormFields({
      title: '',
      description: '',
      eventDate: '',
      location: '',
      latitude: '',
      longitude: '',
    });

    if (posterPreviewUrl && posterPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(posterPreviewUrl);
    }
    setPosterFile(null);
    setExistingPosterUrl(null);
    setPosterPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setIsFormOpen(true);
    setSuccess(false);
  };

  const openEditForm = (ev) => {
    setActionError(null);
    setFieldErrors({});
    setEditingId(ev._id);

    const formattedDate = formatDateForInput(ev.eventDate);
    const currentPoster = getEventPosterUrl(ev);

    setFormFields({
      title: ev.title || '',
      description: ev.description || '',
      eventDate: formattedDate,
      location: ev.location || '',
      latitude:
        ev.coordinates?.latitude !== undefined && ev.coordinates?.latitude !== null
          ? String(ev.coordinates.latitude)
          : '',
      longitude:
        ev.coordinates?.longitude !== undefined && ev.coordinates?.longitude !== null
          ? String(ev.coordinates.longitude)
          : '',
    });

    if (posterPreviewUrl && posterPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(posterPreviewUrl);
    }
    setPosterFile(null);
    setExistingPosterUrl(currentPoster);
    setPosterPreviewUrl(currentPoster);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setIsFormOpen(true);
    setSuccess(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setActionError(null);

    // Client-side validation
    const errors = {};

    if (!formFields.title?.trim() || formFields.title.trim().length < 3) {
      errors.title =
        language === 'en'
          ? 'Title must be at least 3 characters'
          : 'پروگرام کا عنوان کم از کم 3 حروف پر مشتمل ہونا چاہیے';
    } else if (formFields.title.trim().length > 200) {
      errors.title =
        language === 'en'
          ? 'Title cannot exceed 200 characters'
          : 'عنوان 200 حروف سے زیادہ نہیں ہو سکتا';
    }

    if (!formFields.description?.trim() || formFields.description.trim().length < 10) {
      errors.description =
        language === 'en'
          ? 'Description must be at least 10 characters'
          : 'پروگرام کی تفصیل کم از کم 10 حروف پر مشتمل ہونی چاہیے';
    }

    if (!formFields.eventDate) {
      errors.eventDate =
        language === 'en'
          ? 'Event date and time is required'
          : 'پروگرام کی تاریخ اور وقت درکار ہے';
    } else {
      const parsedDate = new Date(formFields.eventDate);
      if (isNaN(parsedDate.getTime())) {
        errors.eventDate =
          language === 'en'
            ? 'Please enter a valid date and time'
            : 'براہ کرم درست تاریخ اور وقت منتخب کریں';
      }
    }

    if (!formFields.location?.trim()) {
      errors.location =
        language === 'en'
          ? 'Event location is required'
          : 'پروگرام کا مقام درکار ہے';
    } else if (formFields.location.trim().length > 300) {
      errors.location =
        language === 'en'
          ? 'Location cannot exceed 300 characters'
          : 'مقام 300 حروف سے زیادہ نہیں ہو سکتا';
    }

    // Coordinates validation
    if (formFields.latitude !== '' && formFields.latitude !== null && formFields.latitude !== undefined) {
      const lat = Number(formFields.latitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        errors.latitude =
          language === 'en'
            ? 'Latitude must be a valid number between -90 and 90'
            : 'عرض بلد (Latitude) کا -90 سے 90 کے درمیان ہونا ضروری ہے';
      }
    }

    if (formFields.longitude !== '' && formFields.longitude !== null && formFields.longitude !== undefined) {
      const lng = Number(formFields.longitude);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        errors.longitude =
          language === 'en'
            ? 'Longitude must be a valid number between -180 and 180'
            : 'طول بلد (Longitude) کا -180 سے 180 کے درمیان ہونا ضروری ہے';
      }
    }

    // Poster validation:
    // Create mode: posterImage is required
    // Edit mode: required only if no existing poster exists
    if (!editingId && !posterFile) {
      errors.posterImage =
        language === 'en'
          ? 'Event poster image is required'
          : 'پروگرام کے پوسٹر کی تصویر لازمی ہے';
    }

    if (posterFile) {
      const fileErr = validateFile(posterFile);
      if (fileErr) {
        errors.posterImage = fileErr;
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setActionError(
        language === 'en'
          ? 'Please correct the highlighted errors before saving.'
          : 'براہ کرم فارم میں نمایاں کی گئی غلطیوں کو درست کریں۔'
      );
      return;
    }

    setFieldErrors({});
    setActionLoading(true);

    if (posterFile) {
      setActionLoadingText(
        language === 'en' ? 'Uploading poster...' : 'پوسٹر اپ لوڈ ہو رہا ہے...'
      );
    } else {
      setActionLoadingText(
        editingId
          ? (language === 'en' ? 'Updating event...' : 'پروگرام اپ ڈیٹ ہو رہا ہے...')
          : (language === 'en' ? 'Creating event...' : 'پروگرام شامل ہو رہا ہے...')
      );
    }

    try {
      // Build multipart FormData
      const formData = new FormData();
      formData.append('title', formFields.title.trim());
      formData.append('description', formFields.description.trim());
      formData.append('eventDate', new Date(formFields.eventDate).toISOString());
      formData.append('location', formFields.location.trim());

      if (formFields.latitude !== '' && formFields.latitude !== null && formFields.latitude !== undefined) {
        formData.append('latitude', formFields.latitude);
      }

      if (formFields.longitude !== '' && formFields.longitude !== null && formFields.longitude !== undefined) {
        formData.append('longitude', formFields.longitude);
      }

      // Only append posterImage if an actual new file was selected
      if (posterFile) {
        formData.append('posterImage', posterFile);
      }

      if (editingId) {
        await updateEvent(editingId, formData);
        showSuccess(
          language === 'en'
            ? 'Event updated successfully.'
            : 'پروگرام کامیابی سے اپ ڈیٹ ہو گیا۔'
        );
      } else {
        await createEvent(formData);
        showSuccess(
          language === 'en'
            ? 'Event created successfully.'
            : 'پروگرام کامیابی سے شامل ہو گیا۔'
        );
      }
    } catch (err) {
      console.error('Failed to save event:', err);
      setActionError(
        err.response?.data?.message || err.message || 'Failed to save event'
      );
    } finally {
      setActionLoading(false);
      setActionLoadingText('');
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
      await deleteEvent(id);
      showSuccess(
        language === 'en'
          ? 'Event deleted successfully.'
          : 'پروگرام کامیابی سے حذف کر دیا گیا۔'
      );
    } catch (err) {
      setActionError(
        err.response?.data?.message || err.message || 'Failed to delete event'
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
    if (posterPreviewUrl && posterPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(posterPreviewUrl);
    }
    setPosterFile(null);
    setExistingPosterUrl(null);
    setPosterPreviewUrl(null);
    loadEvents();
    setTimeout(() => setSuccess(false), 3500);
  };

  return (
    <div
      className={`bg-background py-10 min-h-[80vh] ${
        language === 'ur' ? 'text-right' : 'text-left'
      }`}
      dir={language === 'ur' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Module Header */}
        <div
          className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/50 pb-5 ${
            language === 'ur' ? 'text-right' : 'text-left'
          }`}
        >
          <div className="flex items-center gap-3">
            <Link
              to="/admin/dashboard"
              className="p-2 border border-border bg-white rounded text-slate-500 hover:text-accent shrink-0 transition-colors"
              title={language === 'en' ? 'Back to Dashboard' : 'ڈیش بورڈ پر واپس جائیں'}
            >
              <ArrowRight
                className={`w-4.5 h-4.5 ${language === 'en' ? 'rotate-180' : ''}`}
              />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-primary font-serif">
                {language === 'en' ? 'Manage Events' : 'پروگراموں کا انتظام'}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 font-light">
                {language === 'en'
                  ? 'Schedule, update, and manage community gatherings and educational events'
                  : 'تعلیمی سیمینار، دینی محافل اور دعوتی پروگراموں کا شیڈول اور انتظام کریں'}
              </p>
            </div>
          </div>

          {!isFormOpen && (
            <button
              onClick={openCreateForm}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded text-xs font-bold shadow-sm transition-all uppercase tracking-wider font-serif cursor-pointer"
            >
              <Plus className="w-4 h-4 text-accent" />
              {language === 'en' ? 'Add Event' : 'پروگرام شامل کریں'}
            </button>
          )}
        </div>

        {/* Success alert */}
        {success && (
          <div
            className={`bg-emerald-50 border-r-4 border-emerald-500 p-4 flex items-start gap-2.5 text-emerald-800 text-xs shadow-xs rounded-l ${
              language === 'ur' ? 'text-right' : 'text-left'
            }`}
          >
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        {/* Form vs List Routing */}
        {isFormOpen ? (
          <div className="bg-white border border-border rounded-lg shadow-sm overflow-hidden">
            {/* Form Banner */}
            <div className="bg-primary islamic-pattern text-white px-6 py-4 border-b border-accent/35 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-sm sm:text-md font-serif">
                  {editingId
                    ? language === 'en'
                      ? 'Edit Event Details'
                      : 'پروگرام کی تفصیلات میں ترمیم کریں'
                    : language === 'en'
                    ? 'Add New Educational Event'
                    : 'نیا تعلیمی پروگرام شامل کریں'}
                </h2>
                <p className="text-[11px] text-accent font-light mt-0.5">
                  {language === 'en'
                    ? 'Fields marked with an asterisk (*) are mandatory'
                    : 'ستارے (*) والے خانے لازمی ہیں'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-xs text-secondary hover:text-white underline font-light cursor-pointer"
              >
                {language === 'en' ? 'Cancel' : 'منسوخ کریں'}
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
              {/* Alert error */}
              {actionError && (
                <div
                  className={`bg-red-50 border-r-4 border-red-500 p-4 flex items-start gap-2 text-red-700 text-xs shrink-0 rounded-l ${
                    language === 'ur' ? 'text-right' : 'text-left'
                  }`}
                >
                  <AlertTriangle className="w-4.5 h-4.5 shrink-0 text-red-600" />
                  <span>{actionError}</span>
                </div>
              )}

              {/* ═════════════════════════════════════════════════════════════
                  SECTION 1: EVENT INFORMATION
                  ═════════════════════════════════════════════════════════════ */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <FileText className="w-4 h-4 text-accent" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-serif">
                    {language === 'en' ? '1. Event Information' : '۱. پروگرام کی بنیادی معلومات'}
                  </h3>
                </div>

                {/* Title */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-600 uppercase">
                      {language === 'en' ? 'Event Title' : 'پروگرام کا عنوان'}{' '}
                      <span className="text-red-500 font-bold">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {formFields.title.length}/200
                    </span>
                  </div>
                  <Input
                    type="text"
                    name="title"
                    value={formFields.title}
                    onChange={handleInputChange}
                    required
                    placeholder={
                      language === 'en'
                        ? 'e.g. Halal Investment Workshop Seminar'
                        : 'مثال: حلال سرمایہ کاری ورکشاپ سیمینار'
                    }
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border ${
                      fieldErrors.title ? 'border-red-400 bg-red-50/20' : 'border-border'
                    } rounded outline-none focus:border-accent focus:bg-white transition-all ${
                      language === 'ur' ? 'text-right' : 'text-left'
                    }`}
                    border=""
                  />
                  {fieldErrors.title && (
                    <p className="text-[11px] text-red-600 mt-1 font-medium">
                      {fieldErrors.title}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-600 uppercase">
                      {language === 'en' ? 'Description' : 'پروگرام کی تفصیل'}{' '}
                      <span className="text-red-500 font-bold">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {language === 'en' ? 'Min 10 characters' : 'کم از کم 10 حروف'}
                    </span>
                  </div>
                  <textarea
                    name="description"
                    value={formFields.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder={
                      language === 'en'
                        ? 'Provide detailed information about the schedule, agenda, speakers, registration requirements, etc...'
                        : 'اجتماع کے موضوعات، اہم مقررین، اوقات کار اور رجسٹریشن کی شرائط وغیرہ کے بارے میں تفصیلی معلومات درج کریں...'
                    }
                    className={`w-full px-3 py-2 text-sm bg-slate-50 border ${
                      fieldErrors.description
                        ? 'border-red-400 bg-red-50/20'
                        : 'border-border'
                    } rounded outline-none focus:border-accent focus:bg-white transition-all resize-y ${
                      language === 'ur' ? 'text-right' : 'text-left'
                    }`}
                  ></textarea>
                  {fieldErrors.description && (
                    <p className="text-[11px] text-red-600 mt-1 font-medium">
                      {fieldErrors.description}
                    </p>
                  )}
                </div>
              </div>

              {/* ═════════════════════════════════════════════════════════════
                  SECTION 2: SCHEDULE & LOCATION
                  ═════════════════════════════════════════════════════════════ */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <Calendar className="w-4 h-4 text-accent" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-serif">
                    {language === 'en' ? '2. Schedule & Location' : '۲. شیڈول اور مقام'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Event Date & Time */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                      {language === 'en' ? 'Event Date & Time' : 'پروگرام کی تاریخ اور وقت'}{' '}
                      <span className="text-red-500 font-bold">*</span>
                    </label>
                    <Input
                      type="datetime-local"
                      name="eventDate"
                      value={formFields.eventDate}
                      onChange={handleInputChange}
                      required
                      inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border ${
                        fieldErrors.eventDate
                          ? 'border-red-400 bg-red-50/20'
                          : 'border-border'
                      } rounded outline-none text-slate-700 focus:border-accent focus:bg-white transition-all ${
                        language === 'ur' ? 'text-right' : 'text-left'
                      }`}
                      border=""
                    />
                    {fieldErrors.eventDate && (
                      <p className="text-[11px] text-red-600 mt-1 font-medium">
                        {fieldErrors.eventDate}
                      </p>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                      {language === 'en' ? 'Event Location / Venue' : 'پروگرام کا مقام'}{' '}
                      <span className="text-red-500 font-bold">*</span>
                    </label>
                    <Input
                      type="text"
                      name="location"
                      value={formFields.location}
                      onChange={handleInputChange}
                      required
                      placeholder={
                        language === 'en'
                          ? 'e.g. Masjid Noor, Seminar Hall A, Aurangabad'
                          : 'مثال: جامع مسجد نور، کانفرنس ہال، اورنگ آباد'
                      }
                      inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border ${
                        fieldErrors.location
                          ? 'border-red-400 bg-red-50/20'
                          : 'border-border'
                      } rounded outline-none focus:border-accent focus:bg-white transition-all ${
                        language === 'ur' ? 'text-right' : 'text-left'
                      }`}
                      border=""
                    />
                    {fieldErrors.location && (
                      <p className="text-[11px] text-red-600 mt-1 font-medium">
                        {fieldErrors.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ═════════════════════════════════════════════════════════════
                  SECTION 3: MAP LOCATION (OPTIONAL)
                  ═════════════════════════════════════════════════════════════ */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <Compass className="w-4 h-4 text-accent" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-serif">
                    {language === 'en' ? '3. Map Location (Optional)' : '۳. نقشے کا مقام (اختیاری)'}
                  </h3>
                </div>

                {/* Explanatory Guide Box */}
                <div className="bg-amber-50/70 border border-amber-200 rounded p-3 text-xs text-amber-900 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <p className="font-light leading-relaxed">
                    {language === 'en'
                      ? 'Geographical coordinates are optional. When provided, attendees can tap to get precise GPS navigation via Google Maps. Latitude ranges from -90 to 90, Longitude ranges from -180 to 180.'
                      : 'نقشے کے نقاط (Coordinates) اختیاری ہیں۔ اگر آپ گوگل میپس سے عرض بلد اور طول بلد درج کرتے ہیں تو شرکاء براہ راست جی پی ایس لوکیشن حاصل کر سکیں گے۔'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Latitude */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                      {language === 'en' ? 'Latitude (Optional)' : 'عرض بلد / Latitude (اختیاری)'}
                    </label>
                    <Input
                      type="number"
                      step="any"
                      name="latitude"
                      value={formFields.latitude}
                      onChange={handleInputChange}
                      placeholder="e.g. 24.7538"
                      inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border ${
                        fieldErrors.latitude
                          ? 'border-red-400 bg-red-50/20'
                          : 'border-border'
                      } rounded outline-none focus:border-accent focus:bg-white transition-all ${
                        language === 'ur' ? 'text-right' : 'text-left'
                      }`}
                      border=""
                    />
                    {fieldErrors.latitude ? (
                      <p className="text-[11px] text-red-600 mt-1 font-medium">
                        {fieldErrors.latitude}
                      </p>
                    ) : (
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        -90.0 to 90.0
                      </span>
                    )}
                  </div>

                  {/* Longitude */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                      {language === 'en' ? 'Longitude (Optional)' : 'طول بلد / Longitude (اختیاری)'}
                    </label>
                    <Input
                      type="number"
                      step="any"
                      name="longitude"
                      value={formFields.longitude}
                      onChange={handleInputChange}
                      placeholder="e.g. 84.3725"
                      inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border ${
                        fieldErrors.longitude
                          ? 'border-red-400 bg-red-50/20'
                          : 'border-border'
                      } rounded outline-none focus:border-accent focus:bg-white transition-all ${
                        language === 'ur' ? 'text-right' : 'text-left'
                      }`}
                      border=""
                    />
                    {fieldErrors.longitude ? (
                      <p className="text-[11px] text-red-600 mt-1 font-medium">
                        {fieldErrors.longitude}
                      </p>
                    ) : (
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        -180.0 to 180.0
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* ═════════════════════════════════════════════════════════════
                  SECTION 4: EVENT POSTER (FILE UPLOADER)
                  ═════════════════════════════════════════════════════════════ */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <ImageIcon className="w-4 h-4 text-accent" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-serif">
                    {language === 'en' ? '4. Event Poster' : '۴. پروگرام کا پوسٹر'}
                    {!editingId && <span className="text-red-500 font-bold ml-1">*</span>}
                  </h3>
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* Poster Uploader UI */}
                {posterPreviewUrl ? (
                  /* Selected or Existing Poster Preview Card */
                  <div className="border-2 border-border/80 rounded-lg p-4 bg-slate-50 flex flex-col sm:flex-row items-center sm:items-start gap-4 transition-all">
                    <div className="relative group shrink-0">
                      <img
                        src={posterPreviewUrl}
                        alt="Event Poster Preview"
                        className="w-36 h-48 object-cover rounded-md border border-border shadow-xs bg-white"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-2 text-center sm:text-right">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        {posterFile ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            {language === 'en' ? 'New Poster Selected' : 'نیا پوسٹر منتخب ہو گیا'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                            <ImageIcon className="w-3 h-3 text-accent" />
                            {language === 'en' ? 'Current Poster' : 'موجودہ پوسٹر'}
                          </span>
                        )}
                      </div>

                      {posterFile ? (
                        <div className="space-y-0.5">
                          <p className="text-xs font-semibold text-slate-800 truncate" title={posterFile.name}>
                            {posterFile.name}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono">
                            {(posterFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 font-light">
                          {language === 'en'
                            ? 'Currently saved event poster. If you wish to replace it, click "Change Image" below.'
                            : 'یہ محفوظ شدہ موجودہ پوسٹر ہے۔ اگر نیا پوسٹر لگانا چاہیں تو نیچے "پوسٹر تبدیل کریں" پر کلک کریں۔'}
                        </p>
                      )}

                      <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded shadow-xs transition-colors flex items-center gap-1 cursor-pointer font-serif"
                        >
                          <UploadCloud className="w-3.5 h-3.5 text-accent" />
                          {language === 'en' ? 'Change Image' : 'پوسٹر تبدیل کریں'}
                        </button>

                        {(posterFile || (!existingPosterUrl && posterPreviewUrl)) && (
                          <button
                            type="button"
                            onClick={handleRemovePoster}
                            className="px-3 py-1.5 border border-red-300 text-red-700 hover:bg-red-50 text-xs font-bold rounded transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            {language === 'en' ? 'Remove' : 'حذف کریں'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Empty State / Drag-and-Drop Card */
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                      isDragging
                        ? 'border-accent bg-accent/10 scale-[1.01]'
                        : fieldErrors.posterImage
                        ? 'border-red-400 bg-red-50/20 hover:border-red-500'
                        : 'border-border/80 bg-slate-50/60 hover:border-accent hover:bg-accent/5'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto mb-3">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-primary font-serif">
                      {language === 'en' ? 'Upload Event Poster' : 'پروگرام کا پوسٹر اپ لوڈ کریں'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 font-light">
                      {language === 'en'
                        ? 'Drag & drop or Browse'
                        : 'ڈریگ اور ڈراپ کریں یا فائل منتخب کریں'}
                    </p>
                    <span className="inline-block text-[10px] text-slate-400 font-medium bg-white px-2.5 py-1 border border-slate-200 rounded-full mt-3">
                      {language === 'en'
                        ? 'JPG, PNG, WEBP • Maximum 20 MB'
                        : 'JPG, PNG, WEBP • زیادہ سے زیادہ 20 MB'}
                    </span>
                  </div>
                )}

                {fieldErrors.posterImage && (
                  <p className="text-[11px] text-red-600 mt-1 font-medium">
                    {fieldErrors.posterImage}
                  </p>
                )}
              </div>

              {/* Form Action Buttons */}
              <div className="pt-5 border-t border-slate-200 flex items-center justify-start gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  disabled={actionLoading}
                  className="px-4 py-2 border border-border text-slate-600 rounded text-xs font-bold hover:bg-slate-50 transition-colors uppercase tracking-wider font-serif cursor-pointer disabled:opacity-50"
                >
                  {language === 'en' ? 'Cancel' : 'منسوخ کریں'}
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded text-xs font-bold shadow-sm transition-all uppercase tracking-wider font-serif disabled:opacity-60 cursor-pointer"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 text-accent animate-spin" />
                      <span>
                        {actionLoadingText ||
                          (language === 'en' ? 'Saving...' : 'محفوظ ہو رہا ہے...')}
                      </span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-accent" />
                      <span>
                        {editingId
                          ? language === 'en'
                            ? 'Update Event'
                            : 'پروگرام اپ ڈیٹ کریں'
                          : language === 'en'
                          ? 'Create Event'
                          : 'پروگرام محفوظ کریں'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Events List Table */
          <div className="bg-white border border-border rounded-lg shadow-sm overflow-hidden">
            <Table
              loadingTableContent={loading}
              data={events}
              language={language}
              pageSize={10}
              noRecordText={
                language === 'en'
                  ? 'No events scheduled yet'
                  : 'کوئی پروگرام طے شدہ نہیں ہے'
              }
              tableLayout={[
                {
                  headData: language === 'en' ? 'Event & Poster' : 'پروگرام اور پوسٹر',
                  bodyData: (ev) => {
                    const posterUrl = getEventPosterUrl(ev);
                    return (
                      <div className="flex items-center gap-3 py-1">
                        {posterUrl ? (
                          <button
                            type="button"
                            onClick={() => setPreviewPoster({ url: posterUrl, title: ev.title })}
                            className="relative w-12 h-14 rounded border border-border/70 shrink-0 overflow-hidden bg-slate-100 shadow-2xs group/posterBtn cursor-pointer focus:outline-hidden"
                            title={language === 'en' ? 'Click to preview poster' : 'پوسٹر بڑا کر کے دیکھیں'}
                          >
                            <img
                              src={posterUrl}
                              alt={ev.title}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                if (e.currentTarget.parentElement?.nextElementSibling) {
                                  e.currentTarget.parentElement.nextElementSibling.style.display = 'flex';
                                }
                              }}
                              className="w-full h-full object-cover transition-transform group-hover/posterBtn:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/posterBtn:opacity-100 transition-opacity flex items-center justify-center text-white">
                              <ZoomIn className="w-4 h-4 text-amber-300" />
                            </div>
                          </button>
                        ) : null}
                        <div
                          className={`w-12 h-14 rounded border border-border/40 bg-slate-100 items-center justify-center shrink-0 text-slate-400 ${
                            posterUrl ? 'hidden' : 'flex'
                          }`}
                        >
                          <ImageIcon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="font-bold font-serif text-sm text-primary block truncate max-w-xs sm:max-w-sm">
                            {ev.title}
                          </span>
                          <span className="text-[11px] text-slate-500 font-light block truncate max-w-xs sm:max-w-sm mt-0.5">
                            {ev.description}
                          </span>
                        </div>
                      </div>
                    );
                  },
                  tdClassName: language === 'ur' ? 'text-right' : 'text-left',
                },
                {
                  headData: language === 'en' ? 'Date & Time' : 'تاریخ اور وقت',
                  bodyData: (ev) => {
                    const d = new Date(ev.eventDate);
                    return (
                      <div className="flex flex-col py-1">
                        <span className="font-medium text-xs text-slate-700">
                          {d.toLocaleDateString(
                            language === 'ur' ? 'ur-PK' : 'en-US',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            }
                          )}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {d.toLocaleTimeString(
                            language === 'ur' ? 'ur-PK' : 'en-US',
                            {
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </span>
                      </div>
                    );
                  },
                  tdClassName: language === 'ur' ? 'text-right' : 'text-left',
                },
                {
                  headData: language === 'en' ? 'Location' : 'مقام',
                  bodyData: (ev) => {
                    const mapsUrl = getGoogleMapsUrl(ev);
                    return (
                      <div className="flex flex-col max-w-xs py-1 gap-1">
                        <div className="flex items-start gap-1.5 text-xs text-slate-800 font-medium leading-snug">
                          <MapPin className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                          <span className="break-words" title={ev.location}>{ev.location}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {ev.coordinates?.latitude !== undefined &&
                            ev.coordinates?.longitude !== undefined && (
                              <span className="text-[10px] text-amber-900 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-mono">
                                📍 {ev.coordinates.latitude}, {ev.coordinates.longitude}
                              </span>
                            )}
                          <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent hover:underline cursor-pointer"
                            title={language === 'en' ? 'Open in Google Maps' : 'گوگل میپس میں کھولیں'}
                          >
                            <Navigation className="w-3 h-3 shrink-0" />
                            <span>{language === 'en' ? 'Google Maps' : 'گوگل میپس'}</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-70" />
                          </a>
                        </div>
                      </div>
                    );
                  },
                  tdClassName: language === 'ur' ? 'text-right' : 'text-left',
                },
                {
                  headData: language === 'en' ? 'Actions' : 'اقدامات',
                  bodyData: (ev) => (
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => openEditForm(ev)}
                        className="p-1.5 text-accent hover:bg-amber-50 rounded transition-colors cursor-pointer"
                        title={language === 'en' ? 'Edit' : 'ترمیم کریں'}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ev._id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                        title={language === 'en' ? 'Delete' : 'حذف کریں'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ),
                  tdClassName: language === 'ur' ? 'text-left' : 'text-right',
                },
              ]}
            />
          </div>
        )}
      </div>

      {/* Delete Event Confirmation Box */}
      <ConfirmationBox
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteTargetId(null);
        }}
        onConfirm={handleConfirmDelete}
        title={language === 'en' ? 'Delete Event' : 'پروگرام حذف کرنے کی تصدیق'}
        message={
          language === 'en'
            ? 'Are you sure you want to delete this event? This action cannot be undone.'
            : 'کیا آپ واقعی اس پروگرام کو حذف کرنا چاہتے ہیں؟ یہ عمل واپس نہیں لیا جا سکے گا۔'
        }
        type="danger"
        confirmText={language === 'en' ? 'Delete' : 'ہاں، حذف کریں'}
        cancelText={language === 'en' ? 'Cancel' : 'منسوخ کریں'}
      />

      {/* Poster Preview Modal via Portal */}
      {previewPoster && typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setPreviewPoster(null)}
            dir={language === 'ur' ? 'rtl' : 'ltr'}
          >
            <div
              className="relative max-w-2xl w-full max-h-[92vh] flex flex-col rounded-2xl overflow-hidden bg-white shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b bg-slate-50 shrink-0">
                <span className="text-sm font-bold text-slate-800 truncate pr-2">
                  {previewPoster.title}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={previewPoster.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-accent hover:underline font-semibold px-2 py-1 rounded bg-white border border-slate-200 shadow-2xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{language === 'en' ? 'Full Size' : 'اصل تصویر'}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setPreviewPoster(null)}
                    className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 p-3 overflow-auto flex items-center justify-center bg-slate-900/5">
                <img
                  src={previewPoster.url}
                  alt={previewPoster.title}
                  className="max-w-full max-h-[78vh] object-contain rounded-lg shadow-md select-none"
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
