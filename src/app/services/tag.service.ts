import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";
import {QuerySearchResponse} from "../dto/response.model";
import {enviroments} from "../../enviroments";

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private apiUrl = `${enviroments.API_URL}tag`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getTags():Observable<any>{
    return this.http.get(`${this.apiUrl}/list_tags`)
  }

}
