import { Category, SubCategory } from './../../../models/category';
import { SelectItem } from 'primeng/api';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Product } from '../../../models/product';
import { StepsMenuComponent } from '../../steps-menu/steps-menu.component';
import { ScrapingServiceService } from '../../../services/scraping-service.service';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
// Toaster
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-add-product',
    standalone: true,
    templateUrl: './add-product.component.html',
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        StepsMenuComponent,
        DropdownModule,
        ProgressSpinnerModule,
    ],
    providers: [MessageService]
})
export class AddProductComponent {
    //Variables
    Category: any;
    SubCategory: any;
    Brand: any;
    //Data
    Categories:any;
    //Control
    submitted: boolean = false;
    isLoading: boolean = true;
    isScraping: boolean = false;
    // Constructor
    constructor(
        public scrapingService: ScrapingServiceService,
        public router: Router,
        private messageService: MessageService
    ) {}
    //Init
    ngOnInit() {
        this.isLoading = false;
        this.scrapingService.GetCategories().subscribe(
            // Success
            (data) => {
                this.Categories=data;
                this.Category = this.Categories[0];
                console.log(data);
            },
            // Error
            (error) => {
                console.error('Error', error);
            }
        );
    }
    //Functions
    onCategoryChange() {
        this.scrapingService.scrapingData.productPostDTO.subCategoryId =this.Category.id;
    }
    onSubCategoryChange() {
        this.scrapingService.scrapingData.productPostDTO.subCategoryId =this.SubCategory.id;
    }
    onBrandChange() {
        this.scrapingService.scrapingData.productPostDTO.brandId =this.Brand.id;
    }

    addUrl(): void {
        this.scrapingService.addUrl();
    }

    deleteUrl(index: number): void {
        this.scrapingService.deleteUrl(index);
    }

    saveProduct() {}
    // Navigation
    next() {
        this.isScraping = false;
        console.log(this.scrapingService.urls);
        console.log(this.scrapingService.scrapingData);
        this.scrapingService.GetData(this.scrapingService.urls).subscribe(
            // Success
            (data) => {
                console.log(data);
                if (data.length > 0) {
                    this.scrapingService.scrapingData.productDetailDTO = data;
                    this.isScraping = true;
                    this.router.navigate([
                        '/admin/products/add-product/review',
                    ]);
                } else {
                    // Toaster
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No data found',
                    });
                    //Display Error
                    console.error('No data found');
                }
            },
            // Error
            (error) => {
                console.error('Error', error);
            }
        );
    }

    back() {
        this.router.navigate(['/admin/products']);
    }

    isNextButtonEnabled(): boolean {
        return (
            !this.scrapingService.urls.some(
                (url) => url === 'https://www.example.com/'
            ) && this.scrapingService.urls.length > 0 && this.Brand != null
            && this.Category != null && this.SubCategory != null
             && this.scrapingService.scrapingData.productPostDTO.name_Global != ''
             && this.scrapingService.scrapingData.productPostDTO.description_Global != ''
        );
    }
}
