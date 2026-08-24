import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchSettings,
  updateSettings as updateSettingsThunk,
  changeLanguage as changeLanguageAction,
  requestLanguageChange as requestLanguageChangeAction,
  clearLanguageChangeRequest as clearLanguageChangeRequestAction,
  clearErrors as clearErrorsAction,
} from '@/store/slices/settingsSlice';

export function useSettings() {
  const dispatch = useDispatch();
  const { settings, loading, error, updateSuccess, pendingLanguageChange } = useSelector(
    (state) => state.settings
  );

  useEffect(() => {
    if (settings === null && !loading && !error) {
      dispatch(fetchSettings());
    }
  }, [settings, loading, error, dispatch]);

  const changeLanguage = (newLang) => {
    dispatch(changeLanguageAction(newLang));
  };

  const updateSettings = async (payload) => {
    const result = await dispatch(updateSettingsThunk(payload)).unwrap();
    return result;
  };

  const clearErrors = () => {
    dispatch(clearErrorsAction());
  };

  const requestLanguageChange = (lang) => {
    dispatch(requestLanguageChangeAction(lang));
  };

  const clearLanguageChangeRequest = () => {
    dispatch(clearLanguageChangeRequestAction());
  };

  return {
    settings,
    loading,
    error,
    updateSuccess,
    pendingLanguageChange,
    changeLanguage,
    updateSettings,
    clearErrors,
    requestLanguageChange,
    clearLanguageChangeRequest,
    refreshSettings: () => dispatch(fetchSettings()),
  };
}
