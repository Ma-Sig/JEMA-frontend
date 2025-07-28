import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private baseUrl = environment.apiBaseUrl;
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {}

  public sendMessageToChatbot(message: string): Promise<any> {
    const url = `${this.baseUrl}/chatbot/prompt`;
    const json = {
      question: message,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.getToken()}`,
    });

    return firstValueFrom(this.http.post<any>(url, json, { headers }));
  }

  // Funciones obligatorias
  private getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  private fillUserId(json: any[]): any[] {
    const userId = this.getUserId();
    if (userId !== null) {
      json.forEach((item) => {
        item.userId = userId;
      });
    }
    return json;
  }

  private getUserId(): number | null {
    if (isPlatformBrowser(this.platformId)) {
      return Number(localStorage.getItem('userId')) || 13;
    }
    return 13;
  }
}
