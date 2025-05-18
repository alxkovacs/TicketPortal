import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslationModule } from '../../../../assets/i18n/translation.module';
import { RegisterComponent } from './register.component';

@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: RegisterComponent }
    ]),
    TranslationModule
  ],
  exports: [RegisterComponent]
})
export class RegisterModule { } 