import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { EventListComponent } from './components/event-list/event-list.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { EventService } from './services/event.service';

@NgModule({
  declarations: [
    EventListComponent,
    EventDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: EventListComponent },
      { path: ':id', component: EventDetailComponent }
    ])
  ],
  providers: [EventService],
  exports: [EventListComponent, EventDetailComponent]
})
export class EventsModule { } 