import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {UserMeResponse} from "../dto/response.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8000/user';

  constructor(private http: HttpClient, private authService: AuthService) { }
  myInfo(): Observable<UserMeResponse> {
    return this.http.get<UserMeResponse>(`${this.apiUrl}/me`, { headers: this.authService.getHeader() });
  }
}
