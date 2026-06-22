import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {UserMeResponse} from "../dto/response.model";
import {enviroments} from "../../enviroments";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${enviroments.API_URL}user`;

  constructor(private http: HttpClient, private authService: AuthService) { }
  myInfo(): Observable<UserMeResponse> {
    return this.http.get<UserMeResponse>(`${this.apiUrl}/me`, { headers: this.authService.getHeader() });
  }

  updateInfo(data:any):Observable<any> {
    return this.http.put(`${this.apiUrl}/me`,data,{headers:this.authService.getHeader()})
  }

}
