import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EventListComponent } from './components/event-list/event-list.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { EventFormComponent } from './components/event-form/event-form.component';
import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: EventListComponent },
  { path: 'new', component: EventFormComponent, canActivate: [AuthGuard] },
  { path: ':id', component: EventDetailComponent },
  { path: ':id/edit', component: EventFormComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { } 