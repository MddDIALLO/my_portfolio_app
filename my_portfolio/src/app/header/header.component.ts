import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ValidateTokenService } from '../service/user/validate-token.service';
import { RefreshService } from '../service/refresh.service';
import { Rep } from '../models/response.interface';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  tokenStatus: string = '';
  userRole: string = '';

  constructor(
    private validateToken: ValidateTokenService,
    private router: Router,
    private refreshService: RefreshService
  ) {}

  ngOnInit(): void {
    this.checkTokenValidity();
    this.checkRole();
    this.refreshService.refresh.subscribe(() => {
      this.checkTokenValidity();
      this.checkRole();
    });
  }

  checkRole() {
    const tokenData: string | null = localStorage.getItem('token');
    let role: string = '';

    if (tokenData) {
      const parsedTokenData: Rep = JSON.parse(tokenData);
      role = parsedTokenData.connectedUser.role;

      if(role === 'ADMIN') {
        this.userRole = 'ADMIN'
      }
    }
  }

  checkTokenValidity() {
    if (this.validateToken.checkTokenValidity()) {
      this.tokenStatus = 'Valid token';
    } else {
      this.tokenStatus = 'Invalid token';
    }
  }

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

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  isRegisterPage(): boolean {
    return this.router.url === '/register';
  }

  isAdminPage(): boolean {
    return this.router.url === '/admin';
  }

  isLogedIn(): boolean {
    return this.tokenStatus === 'Valid token';
  }

  isAdmin(): boolean {
    return this.userRole === 'ADMIN';
  }
}
