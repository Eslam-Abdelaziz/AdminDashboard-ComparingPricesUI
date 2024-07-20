import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { FeaturedProductService } from '../../../../app/services/featuredProduct.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TranslateModule } from '@ngx-translate/core';
import { PaidAd } from 'src/app/models/paidAd';

@Component({
    selector: 'featured-product',
    templateUrl: './featured-product.component.html',
    styleUrls: ['./featured-product.component.scss'],
    standalone: true,
    providers: [MessageService],
    imports: [
        CommonModule,
        HttpClientModule,
        CarouselModule,
        ButtonModule,
        ToastModule,
        TranslateModule
    ]
})
export class FeaturedProductComponent implements OnInit {

    products: PaidAd[] = [];

    @ViewChild('favIcon', { static: false }) favIcon!: ElementRef;
    isAuthanciated: boolean = false
    Userid: string = '';
    carouselResponsiveOptions: any[] = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3
        },
        {
            breakpoint: '768px',
            numVisible: 2,
            numScroll: 2
        },
        {
            breakpoint: '560px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    constructor(private productService: FeaturedProductService) { }

    ngOnInit() {
        this.isAuthanciated = localStorage.getItem('UserToken') != null ? true : false
        this.productService.getProducts().subscribe((data: PaidAd[]) => {
            this.products = data;
        });
    }

    onImageError(event: Event) {
        (event.target as HTMLImageElement).src = './assets/layout/images/default-product-image.png';
    }

    getDetails(productLink: string) {
        window.open(productLink, '_blank');
    }

}
