import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaidAd } from '../models/paidAd';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaidAdService {
  private apiUrl: string = environment.api + '/PaidAd';

  constructor(private http: HttpClient) {}

  getPaidAds(): Observable<PaidAd[]> {
    return this.http.get<PaidAd[]>(this.apiUrl);
  }

  getPaidAdById(id: number): Observable<PaidAd> {
    return this.http.get<PaidAd>(`${this.apiUrl}/${id}`);
  }

  addPaidAd(paidAd: PaidAd): Observable<PaidAd> {
    return this.http.post<PaidAd>(this.apiUrl, paidAd);
  }

  updatePaidAd(paidAd: PaidAd): Observable<PaidAd> {
    return this.http.put<PaidAd>(`${this.apiUrl}/${paidAd.id}`, paidAd);
  }

  deletePaidAd(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
