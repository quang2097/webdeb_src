import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {enviroments} from "../../enviroments";

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = `${enviroments.API_URL}upload`;

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

  addUploadUpdate(formData:any,docId:any):Observable<any> {
    return     this.http.put(`${this.apiUrl}/documents/${docId}/add/information`, formData, {
      headers: this.authService.getHeader()
    });
  }

  getDocsStatus(docId:any):Observable<any>{
    return this.http.get(`${this.apiUrl}/documents/${docId}/status`, { headers: this.authService.getHeader() })
  }


  getAllDocsStatus():Observable<any>{
    return this.http.get(`${this.apiUrl}/documents/all/status`, { headers: this.authService.getHeader() })
  }

  uploadAdditionalImage(data:any,documentId:any): Observable<any>{
    return this.http.post(`${this.apiUrl}/documents/${documentId}/images`,data,{headers:this.authService.getHeader()})
  }

  // uploadDoc


}
