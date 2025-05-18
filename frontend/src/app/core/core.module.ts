import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';

import { ApiService } from './services/api.service';
import { ErrorService } from './services/error.service';
import { LoadingService } from './services/loading.service';

import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { LoadingComponent } from './components/loading/loading.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    ErrorMessageComponent,
    LoadingComponent,
    NavbarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
    ErrorMessageComponent,
    LoadingComponent,
    NavbarComponent,
    FooterComponent
  ],
  providers: [
    ApiService,
    ErrorService,
    LoadingService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ]
})
export class CoreModule { } 