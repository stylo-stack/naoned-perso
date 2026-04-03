import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from './locales/fr';
import en from './locales/en';
import br from './locales/br';

export const SUPPORTED_LANGUAGES = ['fr', 'en', 'br'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export function resolveLanguage(locale: string): SupportedLanguage {
  const code = locale.split('-')[0].toLowerCase() as SupportedLanguage;
  return SUPPORTED_LANGUAGES.includes(code) ? code : 'fr';
}

i18n.use(initReactI18next).init({
  lng: 'fr',
  fallbackLng: 'fr',
  resources: {
    fr: { translation: fr },
    en: { translation: en },
    br: { translation: br }
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
