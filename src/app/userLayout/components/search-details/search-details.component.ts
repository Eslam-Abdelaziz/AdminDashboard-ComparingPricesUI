import { Component, ElementRef, ViewChild } from '@angular/core';
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
@Component({
    selector: 'app-search-details',
    standalone: true,
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
        notfoundComponent,
    ],
    templateUrl: './search-details.component.html',
    styleUrl: './search-details.component.scss',
})
export class SearchDetailsComponent {
    foo() {}
    @ViewChild('favIcon', { static: false }) favIcon!: ElementRef;
    pageNumber: number;
    first: number = 1;
    rows: number = 10;
    categoryOptions = [];
    subCategoryOptions = [];
    brandsOptions = [];
    domainOptions = [];
    sortOptions = [
        { name: 'None', value: 0 },
        { name: 'Hight to Low', value: 1 },
        { name: 'Low to High', value: 2 },
        { name: 'Most Viewed', value: 3 },
        { name: 'Most Popular', value: 4 },
        { name: 'Most  Favorite', value: 5 },
        { name: 'Newest', value: 6 },
        { name: 'Oldest', value: 7 },
    ];
    sponser: boolean = false;
    isSponserChecked: boolean = false;
    sidebarVisible: boolean = false;
    selectedSort = new FormControl('');
    rangeValues = new FormControl([,]);
    selectedBrand = new FormControl('');
    selectedSubCategory = new FormControl('');
    selectedCategory = new FormControl('');
    selectedDomain = new FormControl('');
    searchResult!: Brand;
    searchValue: string = '';
    isAuthanciated: boolean = false;
    Userid: string = '';
    constructor(
        private authServ: AuthService,
        private search: SearchService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        // private messageService: MessageService,
        private usersService: UsersService
    ) {}
    ngOnInit() {
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
        this.getAllCat();
        this.getAllBrands();
        this.getAllSubcategory();
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
        this.search.getCategories().subscribe({
            next: (data: Category[]) => {
                this.categoryOptions = data;
            },
        });
    }
    getAllSubcategory() {
        this.subCategoryOptions = this.selectedCategory.value['subCategories'];
    }
    getAllBrands() {
        this.brandsOptions = this.selectedCategory.value['brands'];
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
                next: (data) => {
                    this.searchResult = data;
                },
            });
    }
    updateSlider(event: any, index: number) {
        const newValue = parseFloat(event);

        const newRange = [...this.rangeValues.value];
        newRange[index] = newValue;

        this.rangeValues.setValue(newRange);
    }

    addToFav(product: any, event: Event) {
        event.stopPropagation();
        console.log(this.isAuthanciated);
        if (this.isAuthanciated) {
            this.Userid = this.authServ.GetUserData().uid;
            if (
                this.authServ.GetUserData().roles.includes('Admin') ||
                this.authServ.GetUserData().roles.includes('SuperAdmin')
            ) {
                // this.messageService.add({
                //     severity: 'error',
                //     summary: '',
                //     detail: `you are not User`,
                //     life: 3000,
                // });
                return;
            }
            this.usersService
                .AddFavouriteProduct(this.Userid, product)
                .subscribe({
                    next: (data) => {
                        console.log(data);
                        if (data === 'Already Exists') {
                            // this.messageService.add({
                            //     severity: 'error',
                            //     summary: '',
                            //     detail: `${data}`,
                            //     life: 3000,
                            // });
                        } else {
                            // this.messageService.add({
                            //     severity: 'success',
                            //     summary: 'Successful',
                            //     detail: `${data}`,
                            //     life: 3000,
                            // });
                            product.isFavorite = true;
                            console.log(product.isFavorite);
                            //this.updateFavIcon(product);
                        }
                    },
                    error: (err) => {
                        // this.messageService.add({
                        //     severity: 'error',
                        //     summary: 'error',
                        //     detail: `${err.message}`,
                        //     life: 3000,
                        // });
                        // console.log(err);
                    },
                });
        } else {
            this.router.navigate([`login`]);
        }
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
    updateFavIcon(product: any) {
        if (product.isFavorite) {
            this.favIcon.nativeElement.classList.add(
                'pi-heart-fill',
                'text-red'
            );
            this.favIcon.nativeElement.classList.remove('pi-heart');
        } else {
            this.favIcon.nativeElement.classList.add('pi-heart');
            this.favIcon.nativeElement.classList.remove(
                'pi-heart-fill',
                'text-red'
            );
        }
    }
}
