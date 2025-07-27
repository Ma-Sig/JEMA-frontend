import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ServiceConsumptionService {
  private baseUrl = environment.apiBaseUrl;
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {}

  public getServices(): Promise<any[]> {
    const URL = `${this.baseUrl}/servicios`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json',
    });

    return firstValueFrom(this.http.get<any[]>(URL, { headers }));
  }

  public getConsumptions(): Promise<any[]> {
    const URL = `${this.baseUrl}/consumos-servicio`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json',
    });

    return firstValueFrom(this.http.get<any[]>(URL, { headers }));
  }

  public getConsumptionById(id: number): Promise<any> {
    const URL = `${this.baseUrl}/consumos-servicio/${id}`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json',
    });

    return firstValueFrom(this.http.get<any>(URL, { headers }));
  }

  public getLugares(): Promise<any[]> {
    const URL = `${this.baseUrl}/lugares`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json',
    });

    return firstValueFrom(this.http.get<any[]>(URL, { headers }));
  }

  public createServiceConsumption(consumption: any[]): Promise<any> {
    const URL = `${this.baseUrl}/consumos-servicio`;
    const body = this.fillUserId(consumption);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json',
    });

    return firstValueFrom(this.http.post<any>(URL, body, { headers }));
  }

  public updateServiceConsumption(id: number, consumption: any): Promise<any> {
    const URL = `${this.baseUrl}/consumos-servicio/${id}`;
    const body = {
      ...consumption,
      userId: this.getUserId(),
    };

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json',
    });

    return firstValueFrom(this.http.put<any>(URL, body, { headers }));
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
