import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  // standalone: true,
  // imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private router: Router) {}

  isProjectsPage(): boolean {
    return this.router.url === '/projects';
  }

  isServicesPage(): boolean {
    return this.router.url === '/services';
  }

  isContactPage(): boolean {
    return this.router.url === '/contact';
  }

  isHomePage(): boolean {
    return this.router.url === '/home';
  }
}
