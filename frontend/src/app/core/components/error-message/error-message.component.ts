import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-message',
  template: `
    <div class="alert alert-danger" role="alert" *ngIf="message">
      {{ message }}
    </div>
  `,
  styles: [`
    .alert {
      margin: 1rem 0;
    }
  `]
})
export class ErrorMessageComponent {
  @Input() message: string | null = null;
} 