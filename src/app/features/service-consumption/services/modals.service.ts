import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ModalsService {
  private baseUrl = environment.apiBaseUrl;
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {}

  public createUnit(unit: any): Promise<any> {
    const URL = `${this.baseUrl}/unidades`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json',
    });
    const body = {
      ...unit,
      userId: this.getUserId(),
    };

    return firstValueFrom(this.http.post<any>(URL, body, { headers }));
  }

  public createService(service: any): Promise<any> {
    const URL = `${this.baseUrl}/servicios`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json',
    });
    const body = {
      ...service,
      userId: this.getUserId(),
    };

    return firstValueFrom(this.http.post<any>(URL, body, { headers }));
  }

  public createPlace(place: any): Promise<any> {
    const URL = `${this.baseUrl}/lugares`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json',
    });
    const body = {
      ...place,
      userId: this.getUserId(),
    };

    return firstValueFrom(this.http.post<any>(URL, body, { headers }));
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
