import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {enviroments} from "../../enviroments";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Thay đổi URL này cho khớp với port chạy FastAPI của bạn
  private apiUrl = `${enviroments.API_URL}auth`;

  constructor(private http: HttpClient) { }

  signup(signupData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, signupData);
  }

  login(credentials: {username: string, password: string}): Observable<any> {
    // Sử dụng HttpParams của Angular
    const body = new HttpParams()
      .set('username', credentials.username)
      .set('password', credentials.password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    // Truyền body trực tiếp (tự động chuyển thành string)
    return this.http.post(`${this.apiUrl}/login`, body, { headers });
  }

  createAdmin(userId:any){
    return this.http.put(`${this.apiUrl}/newadmin/${userId}`,{},{headers:this.getHeader()})
  }

  dropAdmin(userId:any){
    return this.http.put(`${this.apiUrl}/dropadmin/${userId}`,{},{headers:this.getHeader()})
  }

  verify_token(){
    return this.http.get(`${this.apiUrl}/verify-token`,{headers : this.getHeader()})
  }

  activateAccount(payload: { user_id: string, otp: string }) {
    return this.http.put(`${this.apiUrl}/activate/account`, payload);
  }

  // Lưu token vào LocalStorage
  saveToken(token: string) {
    localStorage.setItem('access_token', token);
  }

  // Lấy token
  getToken() {
    return localStorage.getItem('access_token');
  }

  deleteToken() {
    localStorage.removeItem('access_token');
  }

  getHeader(){
    return  new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
  }

  forgotPassword(data: { email: string }) {
    return this.http.post(`${this.apiUrl}/forgot-password`, data);
  }

  resetPassword(data: { token: string, new_password: string }) {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }




}
