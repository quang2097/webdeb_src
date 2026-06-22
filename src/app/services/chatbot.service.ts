import {Injectable, Query} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {QuerySearchResponse} from "../dto/response.model";
import {enviroments} from "../../enviroments";

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = `${enviroments.API_URL}chatbot`;

  constructor(private http: HttpClient) { }

  aiSearch(data:any): Observable<any>{
    return this.http.post(`${this.apiUrl}/search`,data)
  }

  aiChatNovel(data:any): Observable<any>{
    return this.http.post(`${this.apiUrl}/novel`,data)
  }

// 1. GET THE HISTORY (Safely parses the JSON)
  getChatbotHistory(): string[] {
    const historyString = localStorage.getItem('chatbot_history');

    // If there is no history, or it's just an empty string, return an empty array
    if (!historyString) {
      return [];
    }

    try {
      // Convert the string back into a real JavaScript array
      return JSON.parse(historyString);
    } catch (error) {
      console.error("History was corrupted, resetting to empty:", error);
      return [];
    }
  }

// 2. SAVE THE HISTORY (Adds new message and turns it back to a string)
  saveChatbotHistory(newBotAnswer: string): void {
    // Get the current array
    const currentHistory = this.getChatbotHistory();

    // Add the new answer to the array
    currentHistory.push(newBotAnswer);

    // Turn the array into a JSON string and save it
    localStorage.setItem('chatbot_history', JSON.stringify(currentHistory));
  }

  deleteChatbotHistory() {
    localStorage.removeItem('chatbot_history');
  }

}
