import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private baseUrl = environment.apiBaseUrl;
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {}

  public getLugares(): Promise<any[]> {
    const URL = `${this.baseUrl}/lugares`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json',
    });

    return firstValueFrom(this.http.get<any[]>(URL, { headers }));
  }

  public getServices(): Promise<any[]> {
    const URL = `${this.baseUrl}/servicios`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json',
    });

    return firstValueFrom(this.http.get<any[]>(URL, { headers }));
  }

  public getItemsPerLocation(location_id: number): Promise<any[]> {
    const URL = `${this.baseUrl}/items/lugar/${location_id}`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json',
    });

    return firstValueFrom(this.http.get<any[]>(URL, { headers }));
  }

  public getItems(): Promise<any[]> {
    const URL = `${this.baseUrl}/items`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json',
    });

    return firstValueFrom(this.http.get<any[]>(URL, { headers }));
  }

  public getServicesConsumption(year: number, mesInicio: number, mesFin: number): Promise<any[]> {
    const url = `${this.baseUrl}/consumos-servicio/general/mensual`;

    const params = new HttpParams()
      .set('year', year.toString())
      .set('mesInicio', mesInicio.toString())
      .set('mesFin', mesFin.toString());

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json',
    });

    return firstValueFrom(this.http.get<any[]>(url, { headers, params }));
  }

  public getItemsByLocation(id_lugar: number): Promise<any[]> {
    const URL = `${this.baseUrl}/items/lugar/${id_lugar}`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json',
    });

    return firstValueFrom(this.http.get<any[]>(URL, { headers }));
  }

  public getConsumptionByService(year: number): Promise<any[]> {
    const URL = `${this.baseUrl}/consumos-servicio/estadisticas/servicio/mensual`;
    const params = new HttpParams().set('year', year.toString());

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json',
    });

    return firstValueFrom(this.http.get<any[]>(URL, { headers, params }));
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
