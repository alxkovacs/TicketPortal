import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TicketFormComponent } from './components/ticket-form/ticket-form.component';
import { TicketListComponent } from './components/ticket-list/ticket-list.component';
import { TicketService } from './services/ticket.service';

@NgModule({
  declarations: [
    TicketFormComponent,
    TicketListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: TicketListComponent },
      { path: 'new', component: TicketFormComponent }
    ])
  ],
  providers: [TicketService],
  exports: [TicketFormComponent, TicketListComponent]
})
export class TicketsModule { } 