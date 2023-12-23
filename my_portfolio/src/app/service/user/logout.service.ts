import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  private API_URL = environment.API_URL;

  constructor(
    private http: HttpClient
  ) {}

  logout(token: string): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }), responseType: 'text' as 'json'
    }

    return this.http.post(`${this.API_URL}/api/users/logout`, { token: token }, options);
  }
}
