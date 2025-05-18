import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  /**
   * Kilépés kezelése
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  
  /**
   * Ellenőrzi, hogy a bejelentkezett felhasználó admin jogosultsággal rendelkezik-e
   * @returns igaz, ha admin jogosultsággal rendelkezik
   */
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}