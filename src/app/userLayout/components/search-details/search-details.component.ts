import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TooltipModule } from 'primeng/tooltip';
import { MultiSelectModule } from 'primeng/multiselect';
import { SliderModule } from 'primeng/slider';
import { InputNumberModule } from 'primeng/inputnumber';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { SearchService } from 'src/app/services/search.service';
import { Brand } from 'src/app/models/Brand';
import { SkeletonModule } from 'primeng/skeleton';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { Category } from 'src/app/models/category';
import { PaginatorModule } from 'primeng/paginator';
import { TruncatePipe } from 'src/app/Pipes/truncate.pipe';
import { notfoundComponent } from '../../../components/not-found/not-found.component';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';
import { UsersService } from 'src/app/services/users.service';
import { ToastModule } from 'primeng/toast';
import { FavoriteService } from 'src/app/services/favorite.service';
import { a } from '@fullcalendar/core/internal-common';

@Component({
    selector: 'app-search-details',
    standalone: true,
    providers: [MessageService],
    imports: [
        TruncatePipe,
        PanelMenuModule,
        MultiSelectModule,
        ReactiveFormsModule,
        FormsModule,
        DividerModule,
        RatingModule,
        CommonModule,
        SliderModule,
        InputNumberModule,
        SkeletonModule,
        SidebarModule,
        ButtonModule,
        CheckboxModule,
        DropdownModule,
        PaginatorModule,
        TooltipModule,
        ToastModule,
        notfoundComponent,
    ],
    templateUrl: './search-details.component.html',
    styleUrls: ['./search-details.component.scss'],
})
export class SearchDetailsComponent implements OnInit {
    notFound: boolean = false;
    lang = localStorage.getItem('language') ?? 'en';
    searchResult: Brand;
    pageNumber: number;
    first: number = 1;
    rows: number = 10;
    categoryOptions = [];
    subCategoryOptions = [];
    brandsOptions = [];
    FavoriteItems = [];
    domainOptions = [];
    sortOptions = [
        { name: 'None', value: 0 },
        { name: 'High to Low', value: 1 },
        { name: 'Low to High', value: 2 },
        { name: 'Most Viewed', value: 3 },
        { name: 'Most Popular', value: 4 },
        { name: 'Most Favorite', value: 5 },
        { name: 'Newest', value: 6 },
        { name: 'Oldest', value: 7 },
    ];
    sponser: boolean = false;
    isSponserChecked: boolean = false;
    sidebarVisible: boolean = false;
    selectedSort = new FormControl('');
    rangeValues = new FormControl([0, 0]);
    selectedBrand = new FormControl('');
    selectedSubCategory = new FormControl('');
    selectedCategory = new FormControl('');
    selectedDomain = new FormControl('');

    searchValue: string = '';
    isAuthanciated: boolean = false;
    Userid: string = '';

    constructor(
        private authServ: AuthService,
        private search: SearchService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private messageService: MessageService,
        private favoriteServ: FavoriteService
    ) {}

    ngOnInit() {
        this.Userid = this.authServ.GetUserData().uid;
        this.getAllFav();

        this.searchValue = this.activatedRoute.snapshot.queryParams['q'];
        this.pageNumber = +this.activatedRoute.snapshot.queryParams['page'];
        this.getAllSearchRes({ searchParam: this.searchValue });
        this.search.currentSearchQuery$.subscribe((query) => {
            if (query) {
                this.searchValue = query;
                this.getAllSearchRes({ searchParam: this.searchValue });
            }
        });

        this.getAllDomains();

        this.isAuthanciated =
            localStorage.getItem('UserToken') != null ? true : false;
    }

    getAllDomains() {
        this.search.gatDomains().subscribe({
            next: (data: any) => {
                this.domainOptions = data;
            },
        });
    }

    getAllCat() {
        this.categoryOptions = this.searchResult?.resultCategories;
    }

    getAllSubcategory() {
        const subCategoriesSet = new Set();
        this.searchResult?.resultCategories.forEach((item) => {
            item.subCategories.forEach(cat=>{
                subCategoriesSet.add(cat)
            })
        });
        this.subCategoryOptions = Array.from(subCategoriesSet);
    }

    getAllBrands() {
        const brandsSet = new Set(); // Use a Set to avoid duplicates

    this.searchResult?.resultCategories.forEach((item) => {
        item.brands.forEach((cat) => {
            brandsSet.add(cat);
        });
    });

    this.brandsOptions = Array.from(brandsSet);
    }

    getAllSearchRes(params: {
        searchParam?: string;
        minPrice?: number;
        maxPrice?: number;
        isFeatured?: boolean;
        sortedBy?: number;
        domainID?: any;
        categoryID?: number;
        subCatId?: number;
        brandId?: any;
        pageNum?: number;
        pageSize?: number;
    }) {
        this.notFound = false;
        this.search
            .getSearchData({
                searchQuery: params.searchParam,
                minPrice: params.minPrice,
                maxPrice: params.maxPrice,
                isFeatured: params.isFeatured,
                sortedBy: params.sortedBy,
                domainID: params.domainID,
                catId: params.categoryID,
                subCatId: params.subCatId,
                brandId: params.brandId,
                pageNum: params.pageNum,
                pageSize: params.pageSize,
            })
            .subscribe({
                next: (data: Brand) => {
                    this.searchResult = data;
                    this.rangeValues.setValue([
                        0,
                        this.searchResult.mostMaxPrice,
                    ]);
                    this.getAllCat();
                    this.getAllSubcategory();
                    this.getAllBrands();
                },
                error: (e) => {
                    console.log(e);
                    this.notFound = true;
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: e,
                    });
                },
            });
    }

    updateSlider(event: any, index: number) {
        const newValue = parseFloat(event);

        const newRange = [...this.rangeValues.value];
        newRange[index] = newValue;

        this.rangeValues.setValue(newRange);
    }

    toggleFavorite(productId: number, event: any) {
        event.stopPropagation();
        if (event.target.classList.contains('pi-heart-fill')) {
            this.deleteFromFav(productId, event);
        } else {
            this.addToFav(productId, event);
        }
    }
    getAllFav() {
        this.favoriteServ.getFavorites(this.Userid).subscribe({
            next: (d: any) => {
                this.FavoriteItems = d;
            },
        });
    }
    isFavorite(prodId: number): boolean {
        return this.FavoriteItems.some((item) => item.productId == prodId);
    }
    addToFav(productId: number, event: any) {
        event.target.classList.remove('pi-heart');
        event.target.classList.add('pi-heart-fill');
        this.favoriteServ.addToFavorite(productId, this.Userid).subscribe({
            next: (v) => {
                console.log('added to favorite', v);
            },
            error: (e) => {
                if (e == 'Added Successfully') {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Added Successfully',
                    });
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: e,
                    });
                }
            },
        });
    }

    deleteFromFav(productId: number, event: any) {
        event.target.classList.remove('pi-heart-fill');
        event.target.classList.add('pi-heart');
        this.favoriteServ.deleteFavorite(productId, this.Userid).subscribe({
            next: (v) => {
                console.log('deleted from favorite', v);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Deleted Successfully',
                });
            },
            error: (e) => {
                console.log('error', e);
            },
        });
    }

    onPageChange(event: any) {
        this.pageNumber += Number(event.page);
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: { page: this.pageNumber.toString() },
            queryParamsHandling: 'merge', // This preserves existing query params while adding/updating the 'page' param
        });
        this.getAllSearchRes({
            searchParam: this.searchValue,
            isFeatured: this.isSponserChecked ? this.sponser : null,
            minPrice: this.rangeValues?.value?.[0] ?? null,
            maxPrice: this.rangeValues?.value?.[1] ?? null,
            categoryID: this.selectedCategory?.value['id'] ?? null,
            sortedBy: this.selectedSort?.value['value'] ?? null,
            domainID: this.selectedDomain?.value ?? null,
            subCatId: this.selectedSubCategory?.value['id'] ?? null,
            brandId: this.selectedBrand?.value ?? null,
            pageNum: this.pageNumber,
            pageSize: 10,
        });
    }

    resetFilter() {
        this.searchValue = '';
        this.search.updateSearchQuery('');
        window.location.reload();
    }
    getDetails(productID: number) {
        // if(this.authServ.GetUserData().roles.includes("Admin")||this.authServ.GetUserData().roles.includes("SuperAdmin")){
        //     return
        // }
        this.router.navigate([`productDetails/${productID}`]);

    }

}
