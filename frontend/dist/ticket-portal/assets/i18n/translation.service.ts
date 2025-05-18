import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { translations, TranslationKey, TranslationLanguage } from './index';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguage = new BehaviorSubject<TranslationLanguage>('hu');
  currentLanguage$ = this.currentLanguage.asObservable();

  constructor() {
    // Betöltjük az alapértelmezett nyelvet a localStorage-ból, ha van
    const savedLanguage = localStorage.getItem('language') as TranslationLanguage;
    if (savedLanguage && translations[savedLanguage]) {
      this.currentLanguage.next(savedLanguage);
    }
  }

  getTranslation(key: TranslationKey): string {
    const language = this.currentLanguage.value;
    const translation = translations[language][key];
    return translation || key;
  }

  setLanguage(language: TranslationLanguage): void {
    if (translations[language]) {
      this.currentLanguage.next(language);
      localStorage.setItem('language', language);
    }
  }

  getCurrentLanguage(): TranslationLanguage {
    return this.currentLanguage.value;
  }
} 