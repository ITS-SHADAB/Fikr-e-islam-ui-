import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSettings as fetchSettingsApi, putSettings as updateSettingsApi } from '@/services';

const normalizeLang = (lang) => {
  if (!lang) return 'ur';
  const l = lang.toString().toLowerCase();
  return (l === 'ur' || l === 'urdu') ? 'ur' : 'en';
};

const getLocalSettings = (apiData) => {
  const localLang = normalizeLang(localStorage.getItem('site_language') || 'ur');
  return {
    ...apiData,
    language: localLang,
    englishFont: localStorage.getItem('site_english_font') || apiData?.englishFont || 'Inter',
    urduFont: localStorage.getItem('site_urdu_font') || apiData?.urduFont || 'Pyami Nastaliq',
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
    settings: null,
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
      } else {
        state.settings = { language: normalized };
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
        state.settings = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
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
