import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSettings as fetchSettingsApi, putSettings as updateSettingsApi } from '@/services';

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
      'جامعہ عارفیہ سید سراواں الہ آباد',
      'دار الافتاء و القضاء',
    ],
    achievements: [
      'مختلف موضوعات پر 15 سے زائد کتب و مقالات',
      'قومی و بین الاقوامی سیمینارز میں شرکت',
    ],
  },
  contactInfo: {
    address: 'دار الافتاء و القضاء، جامعہ عارفیہ، سید سراواں، الہ آباد',
    phone: '+1 (800) 555-ISLAM',
    whatsapp: '+1 (800) 555-WHATS',
    email: 'scholar@islamicknowledge.com',
  },
  socialLinks: {
    facebook: 'https://facebook.com/scholardemo',
    youtube: 'https://youtube.com/scholardemo',
    twitter: 'https://twitter.com/scholardemo',
    instagram: 'https://instagram.com/scholardemo',
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

const loadCachedSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.scholarInfo) {
      return parsed;
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
        contactInfo: settings.contactInfo,
        socialLinks: settings.socialLinks,
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
