import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {UserResponse} from "../dto/response.model";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  // Your FastAPI endpoint
  private apiUrl = 'http://localhost:8000/admin';

  constructor(private http: HttpClient,private authService: AuthService) { }

  getAllUsers(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/users`,{ headers: this.authService.getHeader() });
  }

  deleteUser(userId:any): Observable<any>{
    return this.http.delete(`${this.apiUrl}/user/${userId}`,{ headers: this.authService.getHeader() });
  }

  lockUser(userId:any): Observable<any>{
    return this.http.put(`${this.apiUrl}/user/${userId}/lock`,{ headers: this.authService.getHeader() });
  }

  unlockUser(userId:any): Observable<any>{
    return this.http.put(`${this.apiUrl}/user/${userId}/unlock`,{ headers: this.authService.getHeader() });
  }



}
