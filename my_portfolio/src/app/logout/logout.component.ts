import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogoutService } from '../service/user/logout.service';
import { Rep, Message } from '../models/response.interface';
import { RefreshService } from '../service/refresh.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent implements OnInit {
  constructor(
    private logoutService: LogoutService,
    private router: Router,
    private refreshService: RefreshService
  ) { }

  ngOnInit(): void {
    this.logout();
  }

  logout() {
    const tokenData: string | null = localStorage.getItem('token');
    let token: string = '';

    if (tokenData) {
      const parsedTokenData: Rep = JSON.parse(tokenData);
      token = parsedTokenData.token;
    }

    if (token.length > 0) {
      this.logoutService.logout(token).subscribe(
        response => {
          if(response) {
            const responseMessage: Message = JSON.parse(response);

            if(responseMessage && responseMessage.message === 'Logout successful') {
              console.log(responseMessage.message);
              if(localStorage.getItem('token')) {
                localStorage.removeItem('token');
                this.router.navigate(['/login']);
                this.refreshService.triggerRefresh();
              }
            }
          }
        },
        (error) => {
          console.error('Logout failed:', error);
          this.router.navigate(['/login']);
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
  }
}
