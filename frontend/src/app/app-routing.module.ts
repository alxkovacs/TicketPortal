import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventListComponent } from './components/event/event-list/event-list.component';
import { EventDetailsComponent } from './components/event/event-details/event-details.component';
import { EventFormComponent } from './components/event/event-form/event-form.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { TicketListComponent } from './components/ticket/ticket-list/ticket-list.component';
import { TicketPurchaseComponent } from './components/ticket/ticket-purchase/ticket-purchase.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: '', redirectTo: '/events', pathMatch: 'full' },
  { path: 'events', component: EventListComponent },
  { path: 'events/create', component: EventFormComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'events/:id', component: EventDetailsComponent },
  { path: 'events/:id/edit', component: EventFormComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'events/:id/purchase', component: TicketPurchaseComponent, canActivate: [AuthGuard] },
  { path: 'tickets', component: TicketListComponent, canActivate: [AuthGuard] },
  { path: 'admin/dashboard', component: DashboardComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: '**', redirectTo: '/events' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }