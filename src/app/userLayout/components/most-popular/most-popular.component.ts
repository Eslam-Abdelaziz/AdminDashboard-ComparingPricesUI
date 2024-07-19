
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { MostPopularService } from '../../../../app/services/most-popular.service';
import { FeaturedProduct } from '../../../../app/models/featuredProduct';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'most-popular',
    templateUrl: './most-popular.component.html',
    styleUrl: './most-popular.component.scss',
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
export class MostPopularComponent implements OnInit {
    products: FeaturedProduct[] = [];
    @ViewChild('favIcon', { static: false }) favIcon!: ElementRef;
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
    isAuthanciated: boolean=false
    Userid: string = '';

    constructor( private _router: Router,
        private usersService: UsersService, private authServ: AuthService,
        private messageService: MessageService,private mostPopularService: MostPopularService) { }
    ngOnInit() {
        this.mostPopularService.getProducts(1).subscribe((data: FeaturedProduct[]) => {
            this.products = data;
            this.isAuthanciated=localStorage.getItem('UserToken')!=null?true:false
            // this.products.forEach(product => {
            //     product.isFavorite = false;  // Add isFavorite property initially set to false
            // });
        });

        }


    onImageError(event: Event) {
        (event.target as HTMLImageElement).src = './assets/layout/images/default-product-image.png';
    }

    // toggleFavorite(product: Product) {
    //     product.isFavorite = !product.isFavorite;
    // }

    seeAll() {
        // Add logic for the "See all" button click event
        console.log('See all button clicked');
    }
    getDetails(productID: number) {
        // if(this.authServ.GetUserData().roles.includes("Admin")||this.authServ.GetUserData().roles.includes("SuperAdmin")){
        //     return
        // }
        this._router.navigate([`productDetails/${productID}`]);
        this.usersService.AddHistoryProduct(this.Userid, productID).subscribe({
            next: (data) => {
                //console.log(data);
            },
            error: (err) => {
                //console.log(err);
            },
        });
    }

    addToFav(product: FeaturedProduct, event: Event) {
        event.stopPropagation();
        console.log(this.isAuthanciated)
        if (this.isAuthanciated) {
            this.Userid = this.authServ.GetUserData().uid;
            if(this.authServ.GetUserData().roles.includes("Admin")||this.authServ.GetUserData().roles.includes("SuperAdmin")){
                this.messageService.add({ severity: 'error', summary: '', detail: `you are not User`, life: 3000 });
                return
            }
            this.usersService.AddFavouriteProduct(this.Userid, product.productId).subscribe({
                next: (data) => {
                    console.log(data);
                    if (data === "Already Exists") {
                        this.messageService.add({ severity: 'error', summary: '', detail: `${data}`, life: 3000 });
                    } else {

                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: `${data}`, life: 3000 });
                        product.isFavorite = true;
                        console.log(product.isFavorite)
                        //this.updateFavIcon(product);
                    }
                },
                error: (err) => {
                    this.messageService.add({ severity: 'error', summary: 'error', detail: `${err.message}`, life: 3000 });
                    // console.log(err);
                },
            });
        } else {
            this._router.navigate([`login`]);
        }
    }

    updateFavIcon(product: FeaturedProduct) {
        if (product.isFavorite) {
            this.favIcon.nativeElement.classList.add('pi-heart-fill', 'text-red');
            this.favIcon.nativeElement.classList.remove('pi-heart');
        } else {
            this.favIcon.nativeElement.classList.add('pi-heart');
            this.favIcon.nativeElement.classList.remove('pi-heart-fill', 'text-red');
        }
    }

    STOP(event: Event) {
        event.stopPropagation();
    }
}
