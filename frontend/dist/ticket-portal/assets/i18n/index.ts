import hu from './hu.json';
import en from './en.json';

export const translations = {
  hu,
  en
};

export type TranslationKey = keyof typeof hu;
export type TranslationLanguage = keyof typeof translations;

export * from './translation.service';
export * from './translation.pipe';
export * from './translation.directive';
export * from './translation.component';
export * from './translation.module'; 