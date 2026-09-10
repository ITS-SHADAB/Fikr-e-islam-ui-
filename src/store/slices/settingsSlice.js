import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSettings as fetchSettingsApi, putSettings as updateSettingsApi } from '@/services';
import { OFFICIAL_CONTACT, OFFICIAL_SOCIAL_LINKS } from '@/constants/contact';

export const DEFAULT_SETTINGS = {
  language: 'ur',
  englishFont: 'Inter',
  urduFont: 'Payami Nastaleeq',
  scholarInfo: {
    fullName: 'مفتی محمد فیضان سرور مصباحی',
    title: 'قاضیٔ شریعت، محقق قلم کار، استاذ الحدیث و بانی کنز المکاتب بورڈ',
    bio: 'مفتی محمد فیضان سرور مصباحی، برصغیر کے معروف و معتبر اسلامی اسکالر، محتاط فقیہ اور بلند پایہ محقق قلم کار ہیں۔ آپ ۱۵ ستمبر ۱۹۹۵ء کو موضع بدھول، قاسمۂ، ضلع اورنگ آباد (بہار) میں پیدا ہوئے۔ حفظِ قرآن دارالعلوم فردوسیہ جمشیدپور اور دورۂ حفظ جامعہ فاروقیہ بنارس میں مکمل کیا۔ اس کے بعد برصغیر کے عظیم علمی مرکز جامعہ اشرفیہ مبارک پور میں مسلسل ۱۱ سال تک زیرِ تعلیم رہ کر درسِ نظامی (عالمیت و فضیلت)، قراءتِ حفص، تخصص فی الحدیث اور مشقِ افتاء کی تکمیل فرمائی۔ آپ دار القضاء ادارۂ شرعیہ اورنگ آباد کے منتخب قاضیٔ شریعت، کنز المکاتب بورڈ کے بانی، اور الجامعۃ الغوثیہ للبنات ہواگ کے ناظمِ تعلیمات ہیں۔ آپ تاج الشریعہ مفتی اختر رضا خان قادری کے مرید اور شیخ الاسلام علامہ سید مدنی میاں کچھوچھوی کے خلیفہ و مجاز ہیں۔ آپ صوفی مزاج، سادگی پسند، متواضع اور معاشرتی رسوم و رواج اور جہیز کے خلاف عملی جہاد کے سرخیل ہیں۔',
    education: {
      madrasah: 'جامعہ اشرفیہ مبارک پور، اعظم گڑھ (مسلسل ۱۱ سال: درسِ نظامی، عالمیت، فضیلت، تخصص فی الحدیث و مشقِ افتاء)',
      university: 'دارالعلوم فردوسیہ خانقاہِ شریف جمشیدپور (حفظِ قرآن)، جامعہ فاروقیہ بنارس (دورۂ حفظ)، دار القضاء ادارۂ شرعیہ (سندِ قضاء)',
    },
    qualifications: [
      'حفظِ قرآن کریم (دارالعلوم فردوسیہ خانقاہِ شریف جمشیدپور - ۲۰۰۵ء)',
      'دورۂ حفظِ قرآن مجید (جامعہ فاروقیہ بنارس، زیرِ نگرانی حضرت حافظ عثمان فردوسی)',
      'قراءتِ حفص (جامعہ اشرفیہ مبارک پور)',
      'شہادتِ ثانویہ و مولویت (جامعہ اشرفیہ مبارک پور)',
      'عالمیت و فضیلت (جامعہ اشرفیہ مبارک پور - ۲۰۱۶ء/۲۰۱۷ء)',
      'تخصص فی الحدیث / تحقیق فی الحدیث (جامعہ اشرفیہ مبارک پور)',
      'مشقِ افتاء و فتویٰ نویسی (جامعہ اشرفیہ مبارک پور - ۲۰۱۹ء)',
      'سندِ قضاء و دستارِ قاضیٔ شریعت (دار القضاء ادارۂ شرعیہ اورنگ آباد - ۲۰۲۴ء)',
      'شرفِ بیعت: حضور تاج الشریعہ علامہ مفتی محمد اختر رضا خان ازہری بریلوی علیہ الرحمہ (۲۰۰۷ء)',
      'اجازت و خلافت فی جمیع السلاسل: شیخ الاسلام حضرت علامہ سید محمد مدنی میاں اختر کچھوچھوی مدظلہ (۲۰۲۱ء)'
    ],
    areasOfExpertise: [
      'فقہِ حنفی و اصولِ فقہ',
      'علم الحدیث، اسماء الرجال و تخریجِ احادیث',
      'قضائے شرعی و فیصلہ جاتِ دار القضاء',
      'فتویٰ نویسی و تربیتِ افتاء',
      'تجوید و قراءاتِ قرآنیہ',
      'تحقیق، تصنیف، مقالہ نگاری و تبصرہ نگاری',
      'اصلاحِ معاشرہ، مسنون سادہ نکاح و انسدادِ جہیز',
      'قرآنی مکاتب کا انتظام و نصاب سازی'
    ],
    teachingExperience: 'جامعۃ المدینہ فیضانِ عطار نیپال گنج (نیپال) میں ۳ سال تدریسی خدمات؛ جامعۃ المدینہ فیضانِ امیر معاویہ اورنگ آباد میں ۲ سال کتبِ درسِ نظامی کی تدریس؛ مرکزی دار القراءت ذاکر نگر جمشیدپور (شاخ جامعہ اشرفیہ) میں تدریس؛ ناظمِ تعلیمات الجامعۃ الغوثیہ للبنات ہواگ، رام گڑھ (جھارکھنڈ)؛ استاذ و مربی آن لائن افتاء کورس ”مجلس امام اعظم ابو حنیفہ تربیتِ افتاء“؛ اورنگ آباد کی مرکزی جامع مسجد میں امامت و خطابت کے فرائض۔',
    researchInterests: [
      'زبدۃ الفکر فی مسائل نزھۃ النظر (اصولِ حدیث کی کتاب نزہۃ النظر کی ترجمانی و شرح - ۱۶۰ صفحات)',
      'فیضان المناظرہ (اصولِ مناظرہ کی کتاب مناظرہ رشیدیہ کا ترجمہ بیانی - ۱۵۰ صفحات)',
      'تذکرہ مجددینِ اسلام (۱۴ مجددینِ اسلام کا تحقیقی تذکرہ - ۴۵۰ صفحات)',
      'حدیثِ مجدد: ایک تجزیاتی مطالعہ (مستقل تحقیقی رسالہ - ۳۰ صفحات)',
      'مجتہدینِ اسلام جلد اول: تذکرہ مجتہدین صحابہ و مفتیانِ صحابہ رضی اللہ عنہم (۶۱۶ صفحات)',
      'عہدِ رسالت میں صحابہ کرام کی فقہی و اجتہادی تربیت - کیوں اور کیسے؟ (تحقیقی رسالہ - ۴۳ صفحات)',
      'مجتہدینِ اسلام جلد دوم: تذکرہ مجتہدین تابعین و اہل فتویٰ رحمہم اللہ (۴۶۰ صفحات)',
      'عہدِ تابعین کا فقہی ماحول: ایک تحقیقی مطالعہ (تحقیقی رسالہ - ۳۵ صفحات)',
      'فروغِ رضویات میں فرزندانِ جامعہ اشرفیہ کی خدمات (۶۶۰ صفحات)',
      'امام احمد رضا اور جامعہ اشرفیہ: فکری و علمی روابط (تحقیقی رسالہ - ۳۶ صفحات)',
      'اذنِ عام: چند اصولی مباحث (کووڈ-۱۹ لاک ڈاؤن و جمعہ کے احکام پر تفصیلی کتاب)',
      'گھروں میں نماز باجماعت کے شرعی مسائل',
      'فیضان القراءت حاشیہ ضیاء القراءت (تجوید و فقہ کی روشنی میں تعلیقات)',
      'تہذیب و ترتیب ضیاء القراءت (جدید ترتیب و علاماتِ ترقیم)',
      'اصولِ حدیث میں علمائے پاک و ہند کی قلمی خدمات (۱۰۰ سے زائد کتب کا اجمالی تعارف)',
      'نماز میں ہاتھ کہاں باندھیں (اصولِ محدثین کی روشنی میں مدلل ثبوت)',
      'شرک، توحید اور بدعت کی اصولی تفہیم',
      'مجموعہ فتاویٰ و مقالاتِ علمیہ (ملکی و غیر ملکی مجلات میں شائع شدہ)',
      'فیصلہ جات دار القضاء (۱۰۰ سے زائد تحریری شرعی و عدالتی فیصلے)'
    ],
    institutionsAssociatedWith: [
      'دار القضاء، ادارۂ شرعیہ اورنگ آباد (بہار) - قاضیٔ شریعت',
      'کنز المکاتب بورڈ (بانی و نگرانِ اعلیٰ - ۱۴+ قرآنی مکاتب)',
      'جامعہ اشرفیہ مبارک پور، اعظم گڑھ (مادرِ علمی - ۱۱ سالہ دورانیہ)',
      'الجامعۃ الغوثیہ للبنات ہواگ، رام گڑھ (جھارکھنڈ) - ناظمِ تعلیمات',
      'مرکزی جامع مسجد، اورنگ آباد (بہار) - خطیب و امام',
      'مجلس امام اعظم ابو حنیفہ تربیتِ افتاء - استاد و مربی',
      'تحریک علمائے جھارکھنڈ - اہم رکن',
      'روشن مستقبل، نئی دہلی - بانی ارکان میں شامل',
      'رہنمائے ملت ویلفیئر سوسائٹی و سید الہند لائبریری مبارک پور - بانی رکن',
      'مجلسِ مضمون نگاری ہند (جامعۃ المدینہ ہند) - سابق نگران'
    ],
    achievements: [
      'منصبِ قضاء: دار القضاء ادارۂ شرعیہ اورنگ آباد کے قاضیٔ شریعت کے منصب پر متفقہ انتخاب و دستار بندی (۱۱ فروری ۲۰۲۴ء)',
      'شرفِ بیعت: حضور تاج الشریعہ علامہ مفتی محمد اختر رضا خان ازہری بریلوی علیہ الرحمہ کے دستِ حق پرست پر بیعت (۲۰۰۷ء)',
      'خلافت و اجازت: شیخ الاسلام حضرت علامہ سید محمد مدنی میاں اختر کچھوچھوی سے تمام سلاسلِ طریقت کی اجازت و خلافت (۲۰۲۱ء)',
      'عملی سماجی اصلاح: بغیر جہیز، بغیر باجا بینڈ، مسجد میں مسنون سادگی کے ساتھ نکاح اور مہرِ معجل کی فوری نقد ادائیگی (۲ اپریل ۲۰۲۴ء)',
      'قرآنی مکاتب کا قیام: کنز المکاتب بورڈ کے تحت ملک بھر میں ۱۴ سے زائد منظم قرآنی مکاتب کا کامیاب قیام و سرپرستی',
      'جامع علمی تصانیف: اصولِ حدیث، فقہ، تاریخِ مجتہدین و مجددین پر ۶۰۰ سے زائد صفحات کی ضخیم تحقیقی کتب کی اشاعت',
      'عدالتی فیصلے: دار القضاء کے پلیٹ فارم سے ۱۰۰ سے زائد نزاعی عائلی و دیوانی مقدمات کے محتاط شرعی فیصلے',
      'طلبہ کی قلمی تربیت: سالنامہ باغِ فردوس اور وال میگزین تاباں و ہادی کی ادارت اور دو سال تک خامہ تلاشی کالم کی اشاعت'
    ],
  },
  contactInfo: {
    heading: OFFICIAL_CONTACT.headingUr,
    address: OFFICIAL_CONTACT.address,
    phone: OFFICIAL_CONTACT.phone,
    whatsapp: OFFICIAL_SOCIAL_LINKS.whatsapp,
    email: OFFICIAL_CONTACT.email,
  },
  socialLinks: {
    telegram: OFFICIAL_SOCIAL_LINKS.telegram,
    whatsapp: OFFICIAL_SOCIAL_LINKS.whatsapp,
    youtube: OFFICIAL_SOCIAL_LINKS.youtube,
    facebook: OFFICIAL_SOCIAL_LINKS.facebook,
  },
  homepageSettings: {
    heroName: 'مفتی فیضان سرور مصباحی',
    heroTitle: 'قاضی شریعت و ترجمان اہل سنت',
    heroIntroduction: 'اسلامی تعلیمات، فقہی رہنمائی اور معتدل فکر کی روشنی میں امت کی رہنمائی کے لیے وقف ایک علمی پلیٹ فارم۔',
    heroMission: '"تعلیم و تربیت اور فتاویٰ کے ذریعے معاشرے میں خیر و فلاح کا فروغ۔"',
  },
  seoSettings: {
    metaTitle: 'مفتی فیضان سرور | Mufti Faizan Sarwar',
    metaDescription: 'مفتی فیضان سرور کی آفیشل ویب سائٹ - فتاویٰ، بیانات، مقالات اور کتب',
  },
};

const SETTINGS_CACHE_KEY = 'site_settings_cache';

const normalizeLang = (lang) => {
  if (!lang) return 'ur';
  const l = lang.toString().toLowerCase();
  return (l === 'ur' || l === 'urdu') ? 'ur' : 'en';
};

const isDummyContact = (contact) => {
  if (!contact) return true;
  return (
    contact.email === 'scholar@islamicknowledge.com' ||
    contact.phone?.includes('555-ISLAM') ||
    contact.address?.includes('100 مینار روڈ') ||
    contact.address?.includes('جامعہ عارفیہ')
  );
};

const isDummySocial = (socials) => {
  if (!socials) return true;
  return (
    socials.facebook?.includes('scholardemo') ||
    socials.youtube?.includes('scholardemo') ||
    socials.twitter?.includes('scholardemo') ||
    socials.instagram?.includes('scholardemo')
  );
};

const sanitizeContact = (contact) => {
  if (isDummyContact(contact)) {
    return {
      heading: OFFICIAL_CONTACT.headingUr,
      address: OFFICIAL_CONTACT.address,
      phone: OFFICIAL_CONTACT.phone,
      whatsapp: OFFICIAL_SOCIAL_LINKS.whatsapp,
      email: OFFICIAL_CONTACT.email,
    };
  }
  return {
    ...contact,
    address: contact.address || OFFICIAL_CONTACT.address,
    phone: contact.phone || OFFICIAL_CONTACT.phone,
    whatsapp: contact.whatsapp || OFFICIAL_SOCIAL_LINKS.whatsapp,
    email: contact.email || OFFICIAL_CONTACT.email,
  };
};

const sanitizeSocials = (socials) => {
  if (isDummySocial(socials)) {
    return {
      telegram: OFFICIAL_SOCIAL_LINKS.telegram,
      whatsapp: OFFICIAL_SOCIAL_LINKS.whatsapp,
      youtube: OFFICIAL_SOCIAL_LINKS.youtube,
      facebook: OFFICIAL_SOCIAL_LINKS.facebook,
    };
  }
  return {
    telegram: OFFICIAL_SOCIAL_LINKS.telegram,
    whatsapp: OFFICIAL_SOCIAL_LINKS.whatsapp,
    youtube: socials.youtube || OFFICIAL_SOCIAL_LINKS.youtube,
    facebook: socials.facebook || OFFICIAL_SOCIAL_LINKS.facebook,
    ...socials,
  };
};

const loadCachedSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.scholarInfo) {
      return {
        ...parsed,
        contactInfo: sanitizeContact(parsed.contactInfo),
        socialLinks: sanitizeSocials(parsed.socialLinks),
      };
    }
  } catch (e) {
    console.warn('Failed to parse cached site settings:', e);
  }
  return null;
};

const saveCachedSettings = (settings) => {
  try {
    if (settings && typeof settings === 'object') {
      const toCache = {
        _id: settings._id,
        language: settings.language,
        englishFont: settings.englishFont,
        urduFont: settings.urduFont,
        scholarInfo: settings.scholarInfo,
        contactInfo: sanitizeContact(settings.contactInfo),
        socialLinks: sanitizeSocials(settings.socialLinks),
        homepageSettings: settings.homepageSettings,
        seoSettings: settings.seoSettings,
      };
      localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(toCache));
    }
  } catch (e) {
    console.warn('Failed to cache site settings:', e);
  }
};

const getLocalSettings = (apiData) => {
  const localLang = normalizeLang(localStorage.getItem('site_language') || apiData?.language || 'ur');
  return {
    ...apiData,
    language: localLang,
    englishFont: localStorage.getItem('site_english_font') || apiData?.englishFont || 'Inter',
    urduFont: localStorage.getItem('site_urdu_font') || apiData?.urduFont || 'Payami Nastaleeq',
    contactInfo: sanitizeContact(apiData?.contactInfo),
    socialLinks: sanitizeSocials(apiData?.socialLinks),
  };
};

const getInitialSettings = () => {
  const cached = loadCachedSettings();
  const localLang = normalizeLang(
    localStorage.getItem('site_language') || cached?.language || 'ur'
  );
  const base = cached || DEFAULT_SETTINGS;
  return {
    ...base,
    language: localLang,
    englishFont: localStorage.getItem('site_english_font') || base.englishFont || 'Inter',
    urduFont: localStorage.getItem('site_urdu_font') || base.urduFont || 'Payami Nastaleeq',
    contactInfo: sanitizeContact(base.contactInfo),
    socialLinks: sanitizeSocials(base.socialLinks),
  };
};

export const fetchSettings = createAsyncThunk(
  'settings/fetch',
  async (_, thunkAPI) => {
    try {
      const data = await fetchSettingsApi();
      return getLocalSettings(data);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to load settings';
      return thunkAPI.rejectWithValue(message);
    }
  },
  {
    condition: (force, { getState }) => {
      const { settings } = getState();
      if (settings?.loading) {
        return false;
      }
      if (settings?.isFetched && !force) {
        return false;
      }
    },
  }
);

export const updateSettings = createAsyncThunk(
  'settings/update',
  async (payload, thunkAPI) => {
    try {
      const data = await updateSettingsApi(payload);
      return getLocalSettings(data);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update settings';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    settings: getInitialSettings(),
    isFetched: false,
    loading: false,
    error: null,
    updateSuccess: false,
    pendingLanguageChange: null,
  },
  reducers: {
    changeLanguage: (state, action) => {
      const normalized = normalizeLang(action.payload);
      localStorage.setItem('site_language', normalized);
      if (state.settings) {
        state.settings.language = normalized;
        saveCachedSettings(state.settings);
      } else {
        state.settings = { ...DEFAULT_SETTINGS, language: normalized };
      }
    },
    requestLanguageChange: (state, action) => {
      state.pendingLanguageChange = normalizeLang(action.payload);
    },
    clearLanguageChangeRequest: (state) => {
      state.pendingLanguageChange = null;
    },
    clearErrors: (state) => {
      state.error = null;
      state.updateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Settings
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.isFetched = true;
        state.settings = action.payload;
        saveCachedSettings(action.payload);
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.isFetched = true;
        state.error = action.payload;
      })
      // Update Settings
      .addCase(updateSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
        state.updateSuccess = true;
        saveCachedSettings(action.payload);
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      });
  },
});

export const {
  changeLanguage,
  requestLanguageChange,
  clearLanguageChangeRequest,
  clearErrors,
} = settingsSlice.actions;

export default settingsSlice.reducer;
