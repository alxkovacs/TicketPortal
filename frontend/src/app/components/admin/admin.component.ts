import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../../services/user.service';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  template: `
    <div class="row">
      <div class="col-12 mb-4">
        <h2>Admin Dashboard</h2>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title mb-0">Users</h3>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let user of users">
                    <td>{{ user.firstName }} {{ user.lastName }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.role | titlecase }}</td>
                    <td>
                      <button
                        *ngIf="user.role === 'user'"
                        class="btn btn-sm btn-success"
                        (click)="updateUserRole(user._id, 'admin')"
                      >
                        Make Admin
                      </button>
                      <button
                        *ngIf="user.role === 'admin'"
                        class="btn btn-sm btn-warning"
                        (click)="updateUserRole(user._id, 'user')"
                      >
                        Remove Admin
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title mb-0">Events</h3>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Organizer</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let event of events">
                    <td>{{ event.title }}</td>
                    <td>{{ event.organizer.firstName }} {{ event.organizer.lastName }}</td>
                    <td>{{ event.date | date:'medium' }}</td>
                    <td>
                      <span [class]="event.isActive ? 'text-success' : 'text-danger'">
                        {{ event.isActive ? 'Active' : 'Inactive' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminComponent implements OnInit {
  users: User[] = [];
  events: Event[] = [];

  constructor(
    private userService: UserService,
    private eventService: EventService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadEvents();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Failed to load users:', error);
      }
    });
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.events = events;
      },
      error: (error) => {
        console.error('Failed to load events:', error);
      }
    });
  }

  updateUserRole(userId: string, role: 'user' | 'admin'): void {
    this.userService.updateUserRole(userId, role).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (error) => {
        console.error('Failed to update user role:', error);
      }
    });
  }
} 