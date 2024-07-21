import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaidAd } from '../models/paidAd';

@Injectable({
    providedIn: 'root'
})

export class FeaturedProductService {
    apiUrl : string = environment.api + '/PaidAd';

    constructor(private http: HttpClient) {}

    getProducts(): Observable<PaidAd[]> {
        return this.http.get<PaidAd[]>(`${this.apiUrl}`);
    }

}
