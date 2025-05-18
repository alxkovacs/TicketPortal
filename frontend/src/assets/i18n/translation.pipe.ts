import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from './translation.service';
import { TranslationKey } from './index';

@Pipe({
  name: 'translate',
  pure: false
})
export class TranslationPipe implements PipeTransform {
  constructor(private translationService: TranslationService) {}

  transform(key: TranslationKey): string {
    return this.translationService.getTranslation(key);
  }
} 