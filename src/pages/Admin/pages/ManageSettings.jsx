import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Save, AlertTriangle, Settings, CheckCircle, Info, PhoneCall, Globe, Search, User } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { Input } from '../../../components/Input';
import { ImageViewer, ConfirmationBox } from '@/components';

export default function ManageSettings() {
  const { settings, loading, error, updateSuccess, updateSettings, clearErrors } = useSettings();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  const [activeTab, setActiveTab] = useState('bio');




  // Form states mapping WebsiteSettings schema
  const [scholarInfo, setScholarInfo] = useState({
    fullName: '',
    title: '',
    photo: '',
    bio: '',
    madrasah: '',
    university: '',
    qualifications: '',
    areasOfExpertise: '',
    teachingExperience: '',
    researchInterests: '',
    institutionsAssociatedWith: '',
    achievements: '',
  });

  const [contactInfo, setContactInfo] = useState({
    address: '',
    phone: '',
    whatsapp: '',
    email: '',
  });

  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    youtube: '',
    twitter: '',
    instagram: '',
  });

  const [homepageSettings, setHomepageSettings] = useState({
    heroName: '',
    heroTitle: '',
    heroIntroduction: '',
    heroMission: '',
  });

  const [seoSettings, setSeoSettings] = useState({
    metaTitle: '',
    metaDescription: '',
  });

  // Load database settings into local state inputs
  useEffect(() => {
    if (settings) {
      const info = settings.scholarInfo || {};
      setScholarInfo({
        fullName: info.fullName || '',
        title: info.title || '',
        photo: info.photo || '',
        bio: info.bio || '',
        madrasah: info.education?.madrasah || '',
        university: info.education?.university || '',
        qualifications: info.qualifications ? info.qualifications.join(', ') : '',
        areasOfExpertise: info.areasOfExpertise ? info.areasOfExpertise.join(', ') : '',
        teachingExperience: info.teachingExperience || '',
        researchInterests: info.researchInterests ? info.researchInterests.join(', ') : '',
        institutionsAssociatedWith: info.institutionsAssociatedWith ? info.institutionsAssociatedWith.join(', ') : '',
        achievements: info.achievements ? info.achievements.join(', ') : '',
      });

      const contact = settings.contactInfo || {};
      setContactInfo({
        address: contact.address || '',
        phone: contact.phone || '',
        whatsapp: contact.whatsapp || '',
        email: contact.email || '',
      });

      const socials = settings.socialLinks || {};
      setSocialLinks({
        facebook: socials.facebook || '',
        youtube: socials.youtube || '',
        twitter: socials.twitter || '',
        instagram: socials.instagram || '',
      });

      const home = settings.homepageSettings || {};
      setHomepageSettings({
        heroName: home.heroName || '',
        heroTitle: home.heroTitle || '',
        heroIntroduction: home.heroIntroduction || '',
        heroMission: home.heroMission || '',
      });

      const seo = settings.seoSettings || {};
      setSeoSettings({
        metaTitle: seo.metaTitle || '',
        metaDescription: seo.metaDescription || '',
      });
    }
  }, [settings]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    clearErrors();
    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirmModal(false);
    const splitHelper = (str) =>
      str
        ? str
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s)
        : [];

    const payload = {
      scholarInfo: {
        fullName: scholarInfo.fullName,
        title: scholarInfo.title,
        photo: scholarInfo.photo,
        bio: scholarInfo.bio,
        education: {
          madrasah: scholarInfo.madrasah,
          university: scholarInfo.university,
        },
        qualifications: splitHelper(scholarInfo.qualifications),
        areasOfExpertise: splitHelper(scholarInfo.areasOfExpertise),
        teachingExperience: scholarInfo.teachingExperience,
        researchInterests: splitHelper(scholarInfo.researchInterests),
        institutionsAssociatedWith: splitHelper(scholarInfo.institutionsAssociatedWith),
        achievements: splitHelper(scholarInfo.achievements),
      },
      contactInfo,
      socialLinks,
      homepageSettings,
      seoSettings,
    };

    try {
      await updateSettings(payload);
    } catch (err) {
      console.error(err);
    }
  };



  if (loading && !settings) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'bio', label: language === 'en' ? 'Biography Details' : 'سوانح کی تفصیلات', icon: <Info className="w-4 h-4" /> },
    { id: 'contact', label: language === 'en' ? 'Contact Details' : 'رابطے کی تفصیلات', icon: <PhoneCall className="w-4 h-4" /> },
    { id: 'socials', label: language === 'en' ? 'Social Network' : 'سوشل نیٹ ورک', icon: <Globe className="w-4 h-4" /> },
    { id: 'home', label: language === 'en' ? 'Homepage Hero' : 'ہوم پیج ہیرو', icon: <Settings className="w-4 h-4" /> },
    { id: 'seo', label: language === 'en' ? 'SEO Settings' : 'SEO ترتیبات', icon: <Search className="w-4 h-4" /> },
  ];

  return (
    <div className={`bg-background py-10 min-h-[80vh] ${language === 'ur' ? 'text-right' : 'text-left'}`} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Module Header */}
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/50 pb-5 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
          <div className="flex items-center gap-3">
            <Link to="/admin/dashboard" className="p-2 border border-border bg-white rounded text-slate-500 hover:text-accent shrink-0">
              <ArrowRight className={`w-4.5 h-4.5 ${language === 'en' ? 'rotate-180' : ''}`} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-primary font-serif">
                {language === 'en' ? 'Website Settings' : 'ویب سائٹ کی ترتیبات'}
              </h1>

            </div>
          </div>
        </div>

        {/* Status Alerts */}
        {updateSuccess && (
          <div className={`bg-emerald-50 p-4 flex items-start gap-2.5 text-emerald-800 text-xs shadow-xs ${language === 'ur' ? 'border-r-4 border-emerald-500' : 'border-l-4 border-emerald-500'}`}>
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              {language === 'en' ? 'Website settings updated successfully.' : 'ویب سائٹ کی ترتیبات کامیابی سے اپ ڈیٹ ہو گئیں۔'}
            </span>
          </div>
        )}
        {error && (
          <div className={`bg-red-50 p-4 flex items-start gap-2 text-red-700 text-xs shadow-xs ${language === 'ur' ? 'border-r-4 border-red-500' : 'border-l-4 border-red-500'}`}>
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Settings Tab Selector Bar */}
        <div className="flex flex-wrap border-b border-border/60 gap-1 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                clearErrors();
                setActiveTab(tab.id);
              }}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all uppercase tracking-wider font-serif ${activeTab === tab.id
                ? 'border-accent text-primary'
                : 'border-transparent text-slate-500 hover:text-accent'
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Global Save Form */}
        <form onSubmit={handleFormSubmit} className={`bg-white border border-border p-6 rounded-lg shadow-sm space-y-6 ${language === 'ur' ? 'text-right' : 'text-left'}`}>

          {/* TAB 1: Biography Details */}
          {activeTab === 'bio' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {language === 'en' ? 'Scholar Full Name' : 'عالم کا مکمل نام'}
                  </label>
                  <Input
                    type="text"
                    value={scholarInfo.fullName}
                    onChange={(e) => setScholarInfo({ ...scholarInfo, fullName: e.target.value })}
                    border=""
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {language === 'en' ? 'Honorary Title' : 'اعزازی اسلامی لقب/عنوان'}
                  </label>
                  <Input
                    type="text"
                    value={scholarInfo.title}
                    onChange={(e) => setScholarInfo({ ...scholarInfo, title: e.target.value })}
                    border=""
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {language === 'en' ? 'Scholar Photo URL' : 'عالم کی تصویر کا یو آر ایل'}
                  </label>
                  <Input
                    type="text"
                    value={scholarInfo.photo || ""}
                    onChange={(e) => setScholarInfo({ ...scholarInfo, photo: e.target.value })}
                    border=""
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
                <div className="flex flex-col items-center sm:items-start">
                  <span className="block text-xs font-bold text-slate-500 uppercase mb-1.5 self-center sm:self-start">
                    {language === 'en' ? 'Photo Preview' : 'تصویر کا پیش نظارہ'}
                  </span>
                  <div className="flex items-center justify-center bg-slate-50 border border-slate-200 rounded-lg p-1 min-h-[44px]">
                    {scholarInfo.photo ? (
                      <ImageViewer
                        src={scholarInfo.photo}
                        alt={scholarInfo.fullName || "Scholar Photo"}
                        thumbnailSize={2}
                        thumbnailBorderRadius="rounded"
                        thumbnailObjectFit="cover"
                        showZoomIcon={false}
                      />
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center text-slate-400 bg-slate-100 rounded border border-dashed border-slate-300">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  {language === 'en' ? 'Detailed Biography' : 'تفصیلی سوانح عمری'}
                </label>
                <textarea
                  value={scholarInfo.bio}
                  onChange={(e) => setScholarInfo({ ...scholarInfo, bio: e.target.value })}
                  rows={5}
                  className={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent resize-y ${language === 'ur' ? 'text-right' : 'text-left'}`}
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {language === 'en' ? 'Madrasah Education' : 'مدرسہ کی تعلیم'}
                  </label>
                  <Input
                    type="text"
                    value={scholarInfo.madrasah}
                    onChange={(e) => setScholarInfo({ ...scholarInfo, madrasah: e.target.value })}
                    border=""
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {language === 'en' ? 'University Education' : 'یونیورسٹی کی تعلیم'}
                  </label>
                  <Input
                    type="text"
                    value={scholarInfo.university}
                    onChange={(e) => setScholarInfo({ ...scholarInfo, university: e.target.value })}
                    border=""
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  {language === 'en' ? 'Qualifications (comma separated)' : 'تعلیمی اسناد (کوما سے الگ کریں)'}
                </label>
                <Input
                  type="text"
                  value={scholarInfo.qualifications}
                  onChange={(e) => setScholarInfo({ ...scholarInfo, qualifications: e.target.value })}
                  placeholder={language === 'en' ? 'PhD Shariah, Masters Islamic Law' : 'پی ایچ ڈی شریعہ، ماسٹرز اسلامی قانون'}
                  border=""
                  inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  {language === 'en' ? 'Areas of Expertise (comma separated)' : 'مہارت کے شعبے (کوما سے الگ کریں)'}
                </label>
                <Input
                  type="text"
                  value={scholarInfo.areasOfExpertise}
                  onChange={(e) => setScholarInfo({ ...scholarInfo, areasOfExpertise: e.target.value })}
                  placeholder={language === 'en' ? 'Fiqh, Hadith, Islamic Banking' : 'فقہ، حدیث، اسلامی بینکاری'}
                  border=""
                  inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  {language === 'en' ? 'Summary of Teaching Experience' : 'تدریسی تجربے کا خلاصہ'}
                </label>
                <Input
                  type="text"
                  value={scholarInfo.teachingExperience}
                  onChange={(e) => setScholarInfo({ ...scholarInfo, teachingExperience: e.target.value })}
                  border=""
                  inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {language === 'en' ? 'Research Interests (comma separated)' : 'تحقیقی دلچسپیاں (کوما سے الگ کریں)'}
                  </label>
                  <Input
                    type="text"
                    value={scholarInfo.researchInterests}
                    onChange={(e) => setScholarInfo({ ...scholarInfo, researchInterests: e.target.value })}
                    border=""
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {language === 'en' ? 'Associated Institutions (comma separated)' : 'منسلک ادارے (کوما سے الگ کریں)'}
                  </label>
                  <Input
                    type="text"
                    value={scholarInfo.institutionsAssociatedWith}
                    onChange={(e) => setScholarInfo({ ...scholarInfo, institutionsAssociatedWith: e.target.value })}
                    border=""
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  {language === 'en' ? 'Key Achievements (comma separated)' : 'اہم کامیابیاں (کوما سے الگ کریں)'}
                </label>
                <Input
                  type="text"
                  value={scholarInfo.achievements}
                  onChange={(e) => setScholarInfo({ ...scholarInfo, achievements: e.target.value })}
                  border=""
                  inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                />
              </div>
            </div>
          )}

          {/* TAB 2: Contact Details */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  {language === 'en' ? 'Office Address' : 'دفتر کا پتہ'}
                </label>
                <Input
                  type="text"
                  value={contactInfo.address}
                  onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                  border=""
                  inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {language === 'en' ? 'Phone Number' : 'فون نمبر'}
                  </label>
                  <Input
                    type="text"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    border=""
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {language === 'en' ? 'WhatsApp Link / Number' : 'واٹس ایپ نمبر لنک'}
                  </label>
                  <Input
                    type="text"
                    value={contactInfo.whatsapp}
                    onChange={(e) => setContactInfo({ ...contactInfo, whatsapp: e.target.value })}
                    border=""
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  {language === 'en' ? 'Email Address' : 'ای میل ایڈریس'}
                </label>
                <Input
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                  border=""
                  inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                />
              </div>
            </div>
          )}

          {/* TAB 3: Social Links */}
          {activeTab === 'socials' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {language === 'en' ? 'Facebook Profile Link' : 'فیس بک پروفائل کا لنک'}
                  </label>
                  <Input
                    type="url"
                    value={socialLinks.facebook}
                    onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                    placeholder="https://facebook.com/username"
                    border=""
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {language === 'en' ? 'YouTube Channel Link' : 'یوٹیوب چینل کا لنک'}
                  </label>
                  <Input
                    type="url"
                    value={socialLinks.youtube}
                    onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                    placeholder="https://youtube.com/channel/..."
                    border=""
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {language === 'en' ? 'Twitter / X Link' : 'ٹویٹر / X کا لنک'}
                  </label>
                  <Input
                    type="url"
                    value={socialLinks.twitter}
                    onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                    placeholder="https://twitter.com/username"
                    border=""
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {language === 'en' ? 'Instagram Link' : 'انسٹاگرام کا لنک'}
                  </label>
                  <Input
                    type="url"
                    value={socialLinks.instagram}
                    onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                    placeholder="https://instagram.com/username"
                    border=""
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Homepage settings */}
          {activeTab === 'home' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {language === 'en' ? 'Hero Section Name' : 'ہیرو سیکشن کا نام'}
                  </label>
                  <Input
                    type="text"
                    value={homepageSettings.heroName}
                    onChange={(e) => setHomepageSettings({ ...homepageSettings, heroName: e.target.value })}
                    border=""
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {language === 'en' ? 'Hero Section Title' : 'ہیرو سیکشن کا لقب/عہدہ'}
                  </label>
                  <Input
                    type="text"
                    value={homepageSettings.heroTitle}
                    onChange={(e) => setHomepageSettings({ ...homepageSettings, heroTitle: e.target.value })}
                    border=""
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  {language === 'en' ? 'Hero Section Intro Paragraph' : 'ہیرو سیکشن کا تعارفی پیراگراف'}
                </label>
                <textarea
                  value={homepageSettings.heroIntroduction}
                  onChange={(e) => setHomepageSettings({ ...homepageSettings, heroIntroduction: e.target.value })}
                  rows={3}
                  className={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent resize-y ${language === 'ur' ? 'text-right' : 'text-left'}`}
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  {language === 'en' ? 'Scholar Mission Statement' : 'عالم کا مشن سٹیٹمنٹ'}
                </label>
                <Input
                  type="text"
                  value={homepageSettings.heroMission}
                  onChange={(e) => setHomepageSettings({ ...homepageSettings, heroMission: e.target.value })}
                  border=""
                  inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                />
              </div>
            </div>
          )}

          {/* TAB 5: SEO settings */}
          {activeTab === 'seo' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  {language === 'en' ? 'Default Meta Title Tag' : 'ڈیفالٹ میٹا ٹائٹل ٹیگ'}
                </label>
                <Input
                  type="text"
                  value={seoSettings.metaTitle}
                  onChange={(e) => setSeoSettings({ ...seoSettings, metaTitle: e.target.value })}
                  border=""
                  inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  {language === 'en' ? 'Default Meta Description Tag' : 'ڈیفالٹ میٹا ڈسکرپشن ٹیگ'}
                </label>
                <textarea
                  value={seoSettings.metaDescription}
                  onChange={(e) => setSeoSettings({ ...seoSettings, metaDescription: e.target.value })}
                  rows={4}
                  className={`w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded outline-none focus:border-accent resize-y ${language === 'ur' ? 'text-right' : 'text-left'}`}
                ></textarea>
              </div>
            </div>
          )}

          {/* Form Action save control */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-start">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded text-xs font-bold shadow-sm transition-all uppercase tracking-wider font-serif disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-accent" />
              {loading
                ? (language === 'en' ? 'Saving settings...' : 'ترتیبات محفوظ ہو رہی ہیں...')
                : (language === 'en' ? 'Save Settings' : 'ترتیبات محفوظ کریں')
              }
            </button>
          </div>

        </form>

      </div>

      {/* Save Settings Confirmation Box */}
      <ConfirmationBox
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSave}
        title={language === 'en' ? 'Confirm Website Settings Update' : 'ویب سائٹ کی ترتیبات اپ ڈیٹ کی تصدیق'}
        message={
          language === 'en'
            ? 'Are you sure you want to save the new biography, contact and SEO configuration?'
            : 'کیا آپ واقعی سوانح، رابطے اور SEO کی نئی ترتیبات محفوظ کرنا چاہتے ہیں؟'
        }
        type="warning"
        confirmText={language === 'en' ? 'Save Settings' : 'ترتیبات محفوظ کریں'}
        cancelText={language === 'en' ? 'Cancel' : 'منسوخ کریں'}
      />
    </div>
  );
}



