import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSettings as fetchSettingsApi, putSettings as updateSettingsApi } from '@/services';
import { OFFICIAL_CONTACT, OFFICIAL_SOCIAL_LINKS } from '@/constants/contact';

export const DEFAULT_SETTINGS = {
  language: 'ur',
  englishFont: 'Inter',
  urduFont: 'Payami Nastaleeq',
  scholarInfo: {
    fullName: 'مفتی فیضان سرور مصباحی',
    title: 'قاضی شریعت و ترجمان اہل سنت',
    bio: 'مفتی فیضان سرور ایک نامور عالمِ دین اور فقیہ ہیں جو اپنے علمی اور فکری بیانات کے ذریعے لوگوں کی رہنمائی کرتے ہیں۔',
    education: {
      madrasah: 'جامعہ اشرفیہ مبارک پور / دارالعلوم دیوبند',
      university: 'ایم اے ان اسلامک اسٹڈیز، علی گڑھ',
    },
    qualifications: [
      'ایم اے ان اسلامک اسٹڈیز',
      'تخصص فی الفقہ والافتاء',
      'فاضل درس نظامی',
    ],
    areasOfExpertise: [
      'علم الفقہ',
      'اصول فقہ',
      'حدیث شریف',
      'عقائد اسلامی',
    ],
    teachingExperience: 'شعبہ افتاء میں تدریس کے ساتھ ساتھ دار الافتاء میں فتاویٰ نویسی کا وسیع تجربہ رکھتے ہیں۔',
    researchInterests: [
      'جدید فقہی مسائل اور حل',
      'معاشرے میں اسلامی تعلیمات کا نفاذ',
      'تقابل ادیان و فرق باطلہ',
    ],
    institutionsAssociatedWith: [
      'دارالقضاء ادارۂ شرعیہ اورنگ آباد، بہار (انڈیا)',
      'دار الافتاء و القضاء',
    ],
    achievements: [
      'مختلف موضوعات پر 15 سے زائد کتب و مقالات',
      'قومی و بین الاقوامی سیمینارز میں شرکت',
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
