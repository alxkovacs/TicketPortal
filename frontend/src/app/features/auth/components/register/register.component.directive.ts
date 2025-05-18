import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appRegisterInput]'
})
export class RegisterInputDirective {
  constructor(private el: ElementRef) {}

  @HostListener('focus')
  onFocus(): void {
    this.el.nativeElement.classList.add('focused');
  }

  @HostListener('blur')
  onBlur(): void {
    this.el.nativeElement.classList.remove('focused');
  }

  @HostListener('input')
  onInput(): void {
    const value = this.el.nativeElement.value;
    if (value) {
      this.el.nativeElement.classList.add('has-value');
    } else {
      this.el.nativeElement.classList.remove('has-value');
    }
  }
} 