import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    constructor(private http: HttpClient) { }
    private allProductsUrl: string = 'http://localhost:5066/api/CombinedProduct';
    private confirmProductUrl: string = 'http://localhost:5066/api/confirm-product';
    private productData: any;

    getAllProducts():Observable<any>{
        return this.http.get(this.allProductsUrl);
    }

  setProductData(data: any) {
    this.productData = data;
  }

  getProductData() {
    return this.productData;
  }

  confirmProduct(data: any): Observable<any> {
    return this.http.post(this.confirmProductUrl, data);
  }

  getProductCount() {
    return this.http.get<number>('http://localhost:5066/api/Product/Count')
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
    getProductCount() {
        return this.http.get<number>('http://localhost:5066/api/Product/Count')
            .toPromise()
            .then(res => res as number); 
    }
}
