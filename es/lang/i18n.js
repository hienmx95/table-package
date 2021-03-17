import i18n from 'i18next';
import detector from 'i18next-browser-languagedetector';
import en from './locales/en';
import vi from './locales/vi';
var detectorOptions = {
  order: ['localStorage'],
  lookupLocalStorage: 'lng'
};

i18n.use(detector).init({
  resources: {
    en: en,
    vi: vi
  },
  detection: detectorOptions,

  fallbackLng: 'en',

  interpolation: {
    escapeValue: false
  },

  react: {
    wait: true
  }
});

export default i18n;