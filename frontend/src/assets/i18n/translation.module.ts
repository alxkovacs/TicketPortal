import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from './translation.service';
import { TranslationPipe } from './translation.pipe';
import { TranslationDirective } from './translation.directive';
import { LanguageSelectorComponent } from './translation.component';

@NgModule({
  declarations: [
    TranslationPipe,
    TranslationDirective,
    LanguageSelectorComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TranslationPipe,
    TranslationDirective,
    LanguageSelectorComponent
  ],
  providers: [
    TranslationService
  ]
})
export class TranslationModule { } 