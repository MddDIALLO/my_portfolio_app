import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from '../service/user/register.service';
import { User } from '../models/user.interface';
import { Rep } from '../models/response.interface';
import { RefreshService } from '../service/refresh.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  newUser: User = {} as User;

  user = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  passwordMismatch = false;
  reqIssue = false;
  reqIssueMessage = '';
  connectedUser: any = {
    id: 0,
    username: '',
    image_url: ''
  }

  constructor(
    private registerService: RegisterService,
    private router: Router,
    private refreshService: RefreshService
    ) {}

  register(): void {
    if(this.user.password !== this.user.confirmPassword) {
      this.passwordMismatch = true;
      return;
    }

    this.newUser.id = 0;
    this.newUser.username = this.user.username;
    this.newUser.email = this.user.email;
    this.newUser.password = this.user.password;
    console.log(this.newUser);

    this.registerService.register(this.newUser).subscribe(
      response => {
        const responseData: Rep = JSON.parse(response);
        if (responseData.message === 'User added successfully' && responseData.token) {
          this.connectedUser = responseData.connectedUser;

          const tokenExpiration = new Date().getTime() + 2 * 60 * 60 * 1000;
          const tokenData = {
            token: responseData.token,
            connectedUser: responseData.connectedUser,
            expiresAt: tokenExpiration,
          };

          if(localStorage.getItem('token')) {
            localStorage.removeItem('token');
          }

          localStorage.setItem('token', JSON.stringify(tokenData));
          this.router.navigate(['/home']);
          this.refreshService.triggerRefresh();
        }
      },
      error => {
        if(error.error.message) {
          this.reqIssue = true;
          this.reqIssueMessage = error.error.message;
        }
        console.error('Registration failed:', error);
      }
    );
  }
}
