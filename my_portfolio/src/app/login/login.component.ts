import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../service/user/login.service';
import { Rep } from '../models/response.interface';
import { RefreshService } from '../service/refresh.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  credentialIssue = false;
  reqIssue = false;
  reqIssueMessage = '';
  connectedUser: any = {
    id: 0,
    username: '',
    image_url: ''
  }

  constructor(
    private loginService: LoginService,
    private router: Router,
    private refreshService: RefreshService
    ) {}

  login() {
    if(this.email.length < 10 || this.password.length < 8) {
      this.credentialIssue = true;
      return;
    }

    if(localStorage.getItem('token')) {
      console.log(localStorage.getItem('token'));
    }

    this.loginService.login(this.email, this.password).subscribe(
      response => {
        const responseData: Rep = JSON.parse(response);
        if (responseData.message && responseData.token) {
          this.connectedUser = responseData.connectedUser;

          const tokenExpiration = new Date().getTime() + 2 * 60 * 60 * 1000;
          const tokenData = {
            token: responseData.token,
            connectedUser: responseData.connectedUser,
            expiresAt: tokenExpiration,
          };

          console.log(tokenData);

          if(localStorage.getItem('token')) {
            localStorage.removeItem('token');
          }

          localStorage.setItem('token', JSON.stringify(tokenData));
          this.router.navigate(['/home']);
          this.refreshService.triggerRefresh();
        }
      },
      error => {
        if(error.message) {
          this.reqIssue = true;
          this.reqIssueMessage = error.error.message;
        }
        console.error('Login failed:', error);
      }
    );
  }
}
