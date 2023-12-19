import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private API_URL = environment.API_URL;

  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }), responseType: 'text' as 'json'
  }

  constructor(private http: HttpClient) {}

  register(user: User): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/users`, user, this.options);
  }
}
