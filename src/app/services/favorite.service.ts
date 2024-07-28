import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class FavoriteService {
    private baseUrl: string = environment.api;

    constructor(private http: HttpClient) {}

    addToFavorite(prdId: number, userId: string) {
        let params = new HttpParams();
        params = params.set('id', prdId);
        params = params.set('Userid', userId.toString());

        return this.http
            .post(`${this.baseUrl}/User/AddFavProduct`, {}, { params })
            .pipe(
                catchError((e) => {
                    console.log(e);
                    return throwError(() => e.error.text);
                })
            );
    }

    getFavorites(userId: string) {
        let params = new HttpParams().set('id', userId);

        return this.http
            .get(`${this.baseUrl}/User/FavProduct`, { params })
            .pipe(
                catchError((e) => {
                    return throwError(
                        () => new Error('Error in API request', { cause: e })
                    );
                })
            );
    }

    deleteFavorite(prdId: number, userId: string) {
        let params = new HttpParams().set('id', prdId).set('Userid', userId);
        return this.http
            .delete(`${this.baseUrl}/User/DeleteFavProduct`, { params })
            .pipe(
                catchError((e) => {
                    console.log(e);
                    return throwError(() => e);
                })
            );
    }
}
