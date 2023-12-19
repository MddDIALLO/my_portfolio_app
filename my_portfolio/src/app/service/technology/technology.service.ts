import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TechnologyService {
  private API_URL = environment.API_URL;

  constructor(
    private http: HttpClient
  ) {}

  getTechnologies() {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }), responseType: 'text' as 'json'
    }
    return this.http.get(`${this.API_URL}/technologies`, options);
  }
}
