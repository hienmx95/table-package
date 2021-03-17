import i18n from 'i18next';
import detector from 'i18next-browser-languagedetector';
import en from './locales/en';
import vi from './locales/vi';
const detectorOptions = {
  order: ['localStorage'],
  lookupLocalStorage: 'lng'
};

i18n
  .use(detector)
  .init({
    resources: {
      en,
      vi
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
