import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {

  constructor(private router: Router) { }

  logout(): void {
    // Clear user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Redirect to welcome page
    this.router.navigate(['/welcome']);
  }

  // Function to check if the current route is the welcome page
  isWelcomePage(): boolean {
    return this.router.url === '/welcome';
  }
}
