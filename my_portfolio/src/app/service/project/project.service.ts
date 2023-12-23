import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private API_URL = environment.API_URL;

  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }), responseType: 'text' as 'json'
  }

  constructor(
    private http: HttpClient
  ) {}

  getProjects() {
    return this.http.get(`${this.API_URL}/api/projects`, this.options);
  }
}
