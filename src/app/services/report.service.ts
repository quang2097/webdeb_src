import {Injectable, Query} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {QuerySearchResponse} from "../dto/response.model";
import {ChatSearchRequest} from "../dto/request.model";
import {enviroments} from "../../enviroments";

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = `${enviroments.API_URL}report`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  createReport(novelId:any,data:any){
    return this.http.post(`${this.apiUrl}/${novelId}`,data,{headers:this.authService.getHeader()})
  }

  getReports(pageNumber:any){
    return this.http.get(`${this.apiUrl}?page=${pageNumber}`,{headers:this.authService.getHeader()})
  }

  deleteReport(reportId:any){
    return this.http.delete(`${this.apiUrl}/${reportId}`,{headers:this.authService.getHeader()})
  }

  getMyReports(pageNumber:number){
    return this.http.get(`${this.apiUrl}/mine?page=${pageNumber}`,{headers:this.authService.getHeader()})
  }
}
