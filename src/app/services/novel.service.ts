import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {NovelDetail} from "../dto/response.model";
import {enviroments} from "../../enviroments";

@Injectable({
  providedIn: 'root'
})
export class NovelService {
  private apiUrl = `${enviroments.API_URL}novel`;

  constructor(private http: HttpClient, private authService: AuthService) { }


  getNovelList():Observable<any>{
    return  this.http.get(`${this.apiUrl}`)
  }

  getAllNovels(pageNumber:any):Observable<any>{
    return  this.http.get(`${this.apiUrl}/list?page=${pageNumber}`)
  }

  getNovelByTagId(formData:any):Observable<any>{
    return  this.http.get(`${this.apiUrl}`,formData)
  }

  getNovelsByAllTags(params:any, pageNumber :any):Observable<any>{
    return this.http.get(`${this.apiUrl}/tags/strict?page=${pageNumber}`,{params})
  }

  deleteNodelById(novel_id:any){
    return this.http.delete(`${this.apiUrl}/${novel_id}`,{headers:this.authService.getHeader()})
  }

  getNovelInfoById(novelId: string): Observable<NovelDetail> {
    return this.http.get<NovelDetail>(`${this.apiUrl}/info/${novelId}`,{headers:this.authService.getHeader()});
  }

  getNovelContentById(novelId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/content/${novelId}`);
  }

  getUserDocuments(pageNumber:any){
    return this.http.get(`${this.apiUrl}/documents?page=${pageNumber}`,{headers:this.authService.getHeader()})
  }

  getAdminDocuments(pageNumber:any){
    return this.http.get(`${this.apiUrl}/admin/documents?page=${pageNumber}`,{headers:this.authService.getHeader()})
  }

}
