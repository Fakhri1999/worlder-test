import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// Import the actual translation JSON file
import enTranslations from '../../public/locales/en/translation.json';

// Use the imported translations
const resources = {
  en: {
    translation: enTranslations,
  },
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'en',
  lng: 'en',
  debug: false,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
