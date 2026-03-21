import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { TRANSLATIONS } from './data/translations';

const resources = Object.keys(TRANSLATIONS).reduce((res, lng) => {
  res[lng] = { translation: TRANSLATIONS[lng] };
  return res;
}, {});

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es',
    fallbackLng: 'es',
    interpolation: { escapeValue: false },
    react: { useSuspense: false }
  })
  .catch(() => {});

export default i18n;
