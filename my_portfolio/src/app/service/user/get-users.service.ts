import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GetUsersService {
  private API_URL = environment.API_URL;

  constructor(
    private http: HttpClient
  ) {}

  getUsers(token: string) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }), responseType: 'text' as 'json'
    }
    return this.http.get(`${this.API_URL}/api/users`, options);
  }
}
