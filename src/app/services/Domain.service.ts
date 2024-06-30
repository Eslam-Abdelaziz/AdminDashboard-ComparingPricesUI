import { Domain, DomainProductsCountDTO } from './../models/Domain';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class DomainService {
    private apiUrl = 'https://melakher.azurewebsites.net/api/Domain';

    constructor(private http: HttpClient) { }

    getAllDomains(): Observable<any[]> {
        return this.http.get<any[]>(`http://localhost:5066/api/Domain/All`);
    }

    getDomains(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    addDomain(domain: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, domain);
    }

    updateDomain(id: number, domain: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, domain);
    }

    deleteDomain(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getDomainCount(): Promise<number> {
        return this.http.get<number>('https://melakher.azurewebsites.net/api/Domain/Count')
            .toPromise()
            .then(data => data as number);
    }

    getDomainCountForBrand(): Promise<DomainProductsCountDTO[]> {
        return this.http.get<DomainProductsCountDTO[]>(`https://melakher.azurewebsites.net/api/Domain/productscount`)
            .toPromise()
            .then(data => data as DomainProductsCountDTO[]);
    }
}
