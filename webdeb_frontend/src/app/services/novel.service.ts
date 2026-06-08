import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {NovelDetail} from "../dto/response.model";

@Injectable({
  providedIn: 'root'
})
export class NovelService {
  private apiUrl = 'http://localhost:8000/novel';

  constructor(private http: HttpClient, private authService: AuthService) { }


  getNovelList():Observable<any>{
    return  this.http.get(`${this.apiUrl}`)
  }

  getNovelByTagId(formData:any):Observable<any>{
    return  this.http.get(`${this.apiUrl}`,formData)
  }

  getNovelContentById(novelId: string): Observable<NovelDetail> {
    return this.http.get<NovelDetail>(`${this.apiUrl}/content/${novelId}`);
  }

  // uploadStart(formData:any):Observable<any> {
  //   return    this.http.post(`${this.apiUrl}/pdf/start`, formData, {
  //     headers: this.authService.getHeader(),
  //     reportProgress: true, // Crucial for tracking the upload bar
  //     observe: 'events'
  //   });
  // }
  //
  // uploadUpdate(formData:any,docId:any):Observable<any> {
  //   return     this.http.put(`${this.apiUrl}/documents/${docId}/information`, formData, {
  //     headers: this.authService.getHeader()
  //   });
  // }

}
