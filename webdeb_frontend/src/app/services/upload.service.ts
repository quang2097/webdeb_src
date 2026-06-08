import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = 'http://localhost:8000/upload';

  constructor(private http: HttpClient, private authService: AuthService) { }
  uploadStart(formData:any):Observable<any> {
    return    this.http.post(`${this.apiUrl}/pdf/start`, formData, {
      headers: this.authService.getHeader(),
      reportProgress: true, // Crucial for tracking the upload bar
      observe: 'events'
    });
  }

  uploadUpdate(formData:any,docId:any):Observable<any> {
    return     this.http.put(`${this.apiUrl}/documents/${docId}/information`, formData, {
      headers: this.authService.getHeader()
    });
  }

}
