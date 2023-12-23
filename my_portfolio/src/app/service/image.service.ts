import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private API_URL = environment.API_URL;
  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }), responseType: 'text' as 'json'
  }

  constructor(
    private http: HttpClient
  ) {}

  uploadImage(imageData: string, uploadPath: string, fileName: string) {
    return this.http.post<any>(
      `${this.API_URL}/api/images`,
      { imageData, uploadPath, fileName },
      this.options
    );
  }

  // getImage(filePath: string): Observable<Blob> {
  //   const headers = new HttpHeaders().set('Content-Type', 'image/png');
  //   return this.http.get(`${this.API_URL}/api/images/${encodeURIComponent(filePath)}`, {
  //     responseType: 'blob',
  //     headers: headers
  //   });
  // }
  // getImage(id: string): Observable<Blob> {
  //   return this.http.get(
  //     `${this.API_URL}/api/images/${id}`,
  //     { responseType: 'blob' }
  //     );
  // }
}
