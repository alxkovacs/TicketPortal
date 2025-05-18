import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DecimalPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/nav/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { EventListComponent } from './components/event/event-list/event-list.component';
import { EventDetailsComponent } from './components/event/event-details/event-details.component';
import { EventFormComponent } from './components/event/event-form/event-form.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { TicketListComponent } from './components/ticket/ticket-list/ticket-list.component';
import { TicketPurchaseComponent } from './components/ticket/ticket-purchase/ticket-purchase.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { NavComponent } from './components/nav/nav.component';
import { AuthService } from './services/auth.service';
import { EventService } from './services/event.service';
import { TicketService } from './services/ticket.service';
import { AuthGuard } from './guards/auth.guard';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    NavComponent,
    FooterComponent,
    EventListComponent,
    EventDetailsComponent,
    EventFormComponent,
    LoginComponent,
    RegisterComponent,
    TicketListComponent,
    TicketPurchaseComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthService,
    EventService,
    TicketService,
    AuthGuard,
    CurrencyPipe,
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { } 