import {Injectable, Query} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {QuerySearchResponse} from "../dto/response.model";
import {enviroments} from "../../enviroments";

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = `${enviroments.API_URL}search`;

  constructor(private http: HttpClient, private authService: AuthService) { }
  querySearch(queryData:any): Observable<QuerySearchResponse> {
    return this.http.get<QuerySearchResponse>(`${this.apiUrl}/${queryData}`);
  }

  searchChat(data:any){
    return this.http.post(`${this.apiUrl}/chat`,data);
  }

}
