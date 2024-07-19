import { Injectable } from '@angular/core';
import { Brand } from '../models/Brand';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
    BehaviorSubject,
    catchError,
    Observable,
    take,
    throwError,
} from 'rxjs';
import { Category } from '../models/category';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SearchService {
    baseUrl: string = environment.api;
    private searchQuerySubject = new BehaviorSubject<string>('');
    currentSearchQuery$ = this.searchQuerySubject.asObservable();
    constructor(private http: HttpClient) {}

    getSearchData(param: {
        searchQuery?: string;

        catId?: number;
        subCatId?: number;
        brandId?: number;
        minPrice?: number;
        maxPrice?: number;
        domainID?: number;
        isFeatured?: boolean;
        sortedBy?: number;
        pageNum?: number;
        pageSize?: number;
    }): Observable<Brand> {

        let params = new HttpParams();
        if (param.searchQuery) {
            params = params.set('searchValue', param.searchQuery);
        }


        if (param.catId != null) {
            params = params.set('categoryID', param.catId);
        }
        if (param.pageNum != null) {
            params = params.set('pageNumber', param.pageNum);
        }
        if (param.subCatId != null) {
            params = params.set('subCatID', param.subCatId);
        }
        if (param.brandId != null) {
            if (Array.isArray(param.brandId)) {
                param.brandId.forEach((id) => {
                    params = params.append('brandID', id['id']);
                });
            }
        }
        if (param.minPrice != null) {
            params = params.set('minPrice', param.minPrice);
        }
        if (param.maxPrice != null) {
            params = params.set('maxPrice', param.maxPrice);
        }
        if (param.domainID != null) {
            if (Array.isArray(param.domainID)) {
                param.domainID.forEach((id) => {
                    params = params.append('domainID', id['id']);
                });
            }
        }
        if (param.isFeatured != null) {
            params = params.set('isFeatured', param.isFeatured);
        }
        if (param.sortedBy != null) {
            params = params.set('sortedBy', param.sortedBy);
        }

        return this.http
            .get<Brand>(
                'https://pricecomparing.azurewebsites.net/api/CombinedProduct/search',
                { params: params }
            )
            .pipe(
                take(1),
                catchError((e) => {
                    console.log(e);
                    return throwError(() => new Error('Error in API request'));
                })
            );
    }
    updateSearchQuery(newQuery: string) {
        this.searchQuerySubject.next(newQuery);
    }
    getCategories() {
        return this.http
            .get<Category[]>(
                'https://pricecomparing.azurewebsites.net/api/Category'
            )
            .pipe(
                take(1),
                catchError((e) => {
                    console.log(e);
                    return throwError(() => new Error('Error in API request'));
                })
            );
    }
    gatDomains() {
        return this.http
            .get('https://pricecomparing.azurewebsites.net/api/Domain')
            .pipe(
                take(1),
                catchError((e) => {
                    console.log(e);
                    return throwError(() => new Error('Error in API request'));
                })
            );
    }
}
