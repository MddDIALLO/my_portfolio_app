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
    return this.http.get(`${this.API_URL}/api/technologies`, options);
  }

  getTechnology(id: number) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }), responseType: 'text' as 'json'
    }
    return this.http.get(`${this.API_URL}/api/technologies/${id}`, options);
  }

  addTechnology(type: string, subject: string, name: string, image_url: string) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }), responseType: 'text' as 'json'
    }
    return this.http.post(`${this.API_URL}/api/technologies`, {type, subject, name, image_url}, options);
  }

  updateTechnology(id: number, type: string, subject: string, name: string, image_url: string) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }), responseType: 'text' as 'json'
    }
    return this.http.put(`${this.API_URL}/api/technologies/${id}`, {type, subject, name, image_url}, options);
  }
}
