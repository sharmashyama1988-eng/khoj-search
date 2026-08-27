import type { LangMeta } from '@/types';

export const LANGUAGES: LangMeta[] = [
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr', wikiCode: 'en', dictCode: 'en', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr', wikiCode: 'hi', dictCode: 'hi', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', dir: 'ltr', wikiCode: 'es', dictCode: 'es', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', dir: 'ltr', wikiCode: 'fr', dictCode: 'fr', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', dir: 'ltr', wikiCode: 'de', dictCode: 'de', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', dir: 'ltr', wikiCode: 'it', dictCode: 'it', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', dir: 'ltr', wikiCode: 'pt', dictCode: 'pt', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', dir: 'ltr', wikiCode: 'ru', dictCode: 'ru', flag: '🇷🇺' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl', wikiCode: 'ar', dictCode: 'ar', flag: '🇸🇦' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', dir: 'ltr', wikiCode: 'zh', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', dir: 'ltr', wikiCode: 'ja', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', dir: 'ltr', wikiCode: 'ko', flag: '🇰🇷' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', dir: 'ltr', wikiCode: 'tr', dictCode: 'tr', flag: '🇹🇷' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', dir: 'ltr', wikiCode: 'nl', flag: '🇳🇱' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', dir: 'ltr', wikiCode: 'pl', flag: '🇵🇱' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', dir: 'ltr', wikiCode: 'sv', flag: '🇸🇪' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', dir: 'ltr', wikiCode: 'id', flag: '🇮🇩' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', dir: 'ltr', wikiCode: 'bn', flag: '🇧🇩' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', dir: 'ltr', wikiCode: 'ta', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', dir: 'ltr', wikiCode: 'te', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', dir: 'ltr', wikiCode: 'mr', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', dir: 'rtl', wikiCode: 'ur', flag: '🇵🇰' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', dir: 'rtl', wikiCode: 'fa', flag: '🇮🇷' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', dir: 'ltr', wikiCode: 'uk', flag: '🇺🇦' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', dir: 'ltr', wikiCode: 'vi', flag: '🇻🇳' },
  { code: 'th', name: 'Thai', nativeName: 'ภาษาไทย', dir: 'ltr', wikiCode: 'th', flag: '🇹🇭' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', dir: 'ltr', wikiCode: 'el', flag: '🇬🇷' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', dir: 'ltr', wikiCode: 'cs', flag: '🇨🇿' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', dir: 'ltr', wikiCode: 'ro', flag: '🇷🇴' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', dir: 'ltr', wikiCode: 'hu', flag: '🇭🇺' },
];

export function getLang(code: string): LangMeta {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}

export function getWikiBase(langCode: string): string {
  const lang = getLang(langCode);
  return `https://${lang.wikiCode}.wikipedia.org`;
}

// Dictionary API supports these language codes
export const DICT_SUPPORTED = new Set([
  'en','hi','es','fr','de','it','pt','ru','ar','tr',
  'ja','ko','zh','nl','pl','sv','id','bn','ur','fa',
]);
