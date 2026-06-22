import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {UserResponse} from "../dto/response.model";
import {AuthService} from "./auth.service";
import {enviroments} from "../../enviroments";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  // Your FastAPI endpoint
  private apiUrl = `${enviroments.API_URL}admin`;

  constructor(private http: HttpClient,private authService: AuthService) { }

  getAllUsers(numberPage:any): Observable<any> {
    return this.http.get(`${this.apiUrl}/users?page=${numberPage}`,{ headers: this.authService.getHeader() });
  }

  deleteUser(userId:any): Observable<any>{
    return this.http.delete(`${this.apiUrl}/user/${userId}`,{ headers: this.authService.getHeader() });
  }

  lockUser(userId:any): Observable<any>{
    return this.http.put(`${this.apiUrl}/user/${userId}/lock`,null,{ headers: this.authService.getHeader() });
  }
  unlockUser(userId:any): Observable<any>{
    return this.http.put(`${this.apiUrl}/user/${userId}/unlock`,null,{ headers: this.authService.getHeader() });
  }



}
