import { Component } from '@angular/core';
import { TranslationService } from './translation.service';
import { TranslationLanguage } from './index';

@Component({
  selector: 'app-language-selector',
  template: `
    <div class="language-selector">
      <button
        *ngFor="let language of languages"
        [class.active]="language === currentLanguage"
        (click)="setLanguage(language)"
      >
        {{ language.toUpperCase() }}
      </button>
    </div>
  `,
  styles: [`
    .language-selector {
      display: flex;
      gap: 8px;
    }

    button {
      padding: 4px 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    button:hover {
      background-color: #f5f5f5;
    }

    button.active {
      background-color: #1976d2;
      color: white;
      border-color: #1976d2;
    }
  `]
})
export class LanguageSelectorComponent {
  languages: TranslationLanguage[] = ['hu', 'en'];
  currentLanguage: TranslationLanguage;

  constructor(private translationService: TranslationService) {
    this.currentLanguage = this.translationService.getCurrentLanguage();
  }

  setLanguage(language: TranslationLanguage): void {
    this.translationService.setLanguage(language);
    this.currentLanguage = language;
  }
} 