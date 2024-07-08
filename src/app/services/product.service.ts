import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    constructor(private http: HttpClient) { }
    apiUrl: string = environment.api;

    //private getAllProductsUrl: string = 'http://localhost:5066/api/CombinedProduct';
    //private confirmProductUrl: string = 'http://localhost:5066/api/confirm-product';
    // private deleteProductUrl: string = 'http://localhost:5066/api/CombinedProduct/';
    //private bulkDeleteUrl: string = 'http://localhost:5066/api/CombinedProduct/bulk-delete';

    private productData: any;

    getAllProducts(): Observable<any> {
        return this.http.get(`${this.apiUrl}/CombinedProduct`);
    }

    deleteProduct(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/CombinedProduct/${id}`);
    }

    bulkDeleteProducts(ids: number[]): Observable<any> {
        return this.http.post(`${this.apiUrl}/CombinedProduct/bulk-delete`, { body: ids });
    }

    setProductData(data: any) {
        this.productData = data;
    }

    getProductData() {
        return this.productData;
    }

    confirmProduct(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/confirm-product`, data);
    }


    getProductCount() {
        return this.http.get<number>(`${this.apiUrl}/Product/Count`)
            .toPromise()
            .then(res => res as number);
    }

    getProductsSmall() {
        return this.http.get<any>('assets/demo/data/products-small.json')
            .toPromise()
            .then(res => res.data as Product[])
            .then(data => data);
    }

    getProducts() {
        return this.http.get<any>('assets/demo/data/products.json')
            .toPromise()
            .then(res => res.data as Product[])
            .then(data => data);
    }

    getProductsMixed() {
        return this.http.get<any>('assets/demo/data/products-mixed.json')
            .toPromise()
            .then(res => res.data as Product[])
            .then(data => data);
    }

    getProductsWithOrdersSmall() {
        return this.http.get<any>('assets/demo/data/products-orders-small.json')
            .toPromise()
            .then(res => res.data as Product[])
            .then(data => data);
    }

    getPproductDetails(id: number) {
        return this.http.get<any>(`${this.apiUrl}/CombinedProduct/${id}`);
    }
}
