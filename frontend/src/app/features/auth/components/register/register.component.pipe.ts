import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../../../../assets/i18n/translation.service';

@Pipe({
  name: 'registerError'
})
export class RegisterErrorPipe implements PipeTransform {
  constructor(private translationService: TranslationService) {}

  transform(value: string): string {
    return this.translationService.getTranslation(value);
  }
} 