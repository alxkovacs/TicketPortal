import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TicketListComponent } from './components/ticket-list/ticket-list.component';
import { TicketDetailComponent } from './components/ticket-detail/ticket-detail.component';
import { TicketFormComponent } from './components/ticket-form/ticket-form.component';
import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: TicketListComponent, canActivate: [AuthGuard] },
  { path: 'new', component: TicketFormComponent, canActivate: [AuthGuard] },
  { path: ':id', component: TicketDetailComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketsRoutingModule { } 