import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ValidateTokenService {
  checkTokenValidity(): boolean {
    const tokenData = localStorage.getItem('token');

    if (tokenData) {
      const parsedTokenData = JSON.parse(tokenData);

      if (parsedTokenData && parsedTokenData.expiresAt) {
        const currentTime = new Date().getTime();
        const tokenExpiration = parsedTokenData.expiresAt;

        if (currentTime > tokenExpiration) {
          localStorage.removeItem('token');
          return false;
        } else {
          return true;
        }
      }
    }

    return false;
  }
}
