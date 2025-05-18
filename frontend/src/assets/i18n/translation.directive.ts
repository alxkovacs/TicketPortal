import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslationService } from './translation.service';
import { TranslationKey } from './index';

@Directive({
  selector: '[translate]'
})
export class TranslationDirective implements OnChanges {
  @Input() translate: TranslationKey = '';

  constructor(
    private elementRef: ElementRef,
    private translationService: TranslationService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['translate']) {
      this.updateTranslation();
    }
  }

  private updateTranslation(): void {
    const translation = this.translationService.getTranslation(this.translate);
    this.elementRef.nativeElement.textContent = translation;
  }
} 