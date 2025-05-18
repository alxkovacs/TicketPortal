import { Component, OnInit } from '@angular/core';
import { AuthService } from './features/auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Ticket Portal';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // No need to call loadUser as it's handled in the AuthService constructor
  }

  logout(): void {
    this.authService.logout();
  }
} 