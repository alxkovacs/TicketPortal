import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="footer mt-auto py-3 bg-dark text-white">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <h5>Ticket Portal</h5>
            <p>Your one-stop destination for event tickets.</p>
          </div>
          <div class="col-md-3">
            <h5>Quick Links</h5>
            <ul class="list-unstyled">
              <li><a routerLink="/events" class="text-white">Events</a></li>
              <li><a routerLink="/tickets" class="text-white">My Tickets</a></li>
              <li><a routerLink="/auth/login" class="text-white">Login</a></li>
              <li><a routerLink="/auth/register" class="text-white">Register</a></li>
            </ul>
          </div>
          <div class="col-md-3">
            <h5>Contact</h5>
            <ul class="list-unstyled">
              <li>Email: info@ticketportal.com</li>
              <li>Phone: +1 234 567 890</li>
              <li>Address: 123 Event Street, City</li>
            </ul>
          </div>
        </div>
        <hr class="bg-light">
        <div class="text-center">
          <p class="mb-0">&copy; {{ currentYear }} Ticket Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      margin-top: auto;
    }
    a {
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  `]
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
} 