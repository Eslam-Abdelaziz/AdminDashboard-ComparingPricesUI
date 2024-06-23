import { SubCategoryService } from './../../services/subcategory.service';
import { DomainProductsCountDTO } from './../../models/Domain';
import { UsersService } from 'src/app/services/users.service';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { BrandService } from '../../services/brand.service';
import { CategoryService } from '../../services/category.service';
import { DomainService } from 'src/app/services/Domain.service';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { RouterModule } from '@angular/router';
import { BrandProductsCountDTO } from '../../models/Brand';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    //styleUrls: ['./dashboard.component.css'], // Added CSS file path
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ChartModule,
        MenuModule,
        TableModule,
        ButtonModule,
        StyleClassModule,
        PanelMenuModule,
        RouterModule,
    ],
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
    items!: MenuItem[];
    productCount: number = 0;
    BrandCount: number = 0;
    categoryCount: number = 0;
    userCount: number = 0;
    domainCount: number = 0;
    subCategoryCount: number = 0;


    products!: Product[];

    chartData: any;

    chartOptions: any;

    // Corrected: Added declarations for domainChartData and domainChartOptions
    domainChartData: any;
    domainChartOptions: any;

    categoryChartData: any;
    categoryChartOptions: any;

    userChartData: any;
    userChartOptions: any;

    subscription!: Subscription;

    constructor(private productService: ProductService,
                public layoutService: LayoutService,
                private brandService: BrandService,
                private categoryService: CategoryService,
                private UsersService: UsersService,
                private domainService: DomainService,
                private SubCategoryService: SubCategoryService,

                private changeDetectorRef: ChangeDetectorRef) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe((config) => {
                this.initChart();
            });
    }


    ngOnInit() {
        this.productService.getProductsSmall().then(data => this.products = data);

        Promise.all([
            this.getProductCount(),
            this.getBrandCount(),
            this.getCategoryCount(),
            this.getUserCount(),
            this.getDomainCount(),
            this.getSubCategoryCount(),
            this.brandService.getProductCountForBrand(),
            this.domainService.getDomainCountForBrand(),
            this.categoryService.getBrandCountForCategory(),
            this.UsersService.getUserCountByTIme()

        ]).then((counts) => {
            const [productCount, brandCount, categoryCount, userCount, domainCount, subCategoryCount,brandProductCounts, domainProductCounts , categoryBrandCounts , usersOverTimeCounts] = counts;
            this.productCount = productCount;
            this.BrandCount = brandCount;
            this.categoryCount = categoryCount;
            this.userCount = userCount;
            this.domainCount = domainCount;
            this.subCategoryCount = subCategoryCount;




            this.processChartData(brandProductCounts);
           this.processDomainChartData(domainProductCounts);
           this.processCategoryChartData(categoryBrandCounts);
           this.processUserChartData(usersOverTimeCounts);
            this.initChart();
        });

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ];
    }

    getProductCount(): Promise<number> {
        return this.productService.getProductCount()
            .then(count => count)
            .catch(error => {
                console.error('Error fetching product count:', error);
                throw error;
            });
    }

    getBrandCount(): Promise<number> {
        return this.brandService.getBrandCount()
            .then(count => count)
            .catch(error => {
                console.error('Error fetching brand count:', error);
                throw error;
            });
    }

    getCategoryCount(): Promise<number> {
        return this.categoryService.getCategoryCount()
            .then(count => count)
            .catch(error => {
                console.error('Error fetching category count:', error);
                throw error;
            });
    }

    getUserCount(): Promise<number> {
        return this.UsersService.getUserCount()
            .then(count => count)
            .catch(error => {
                console.error('Error fetching user count:', error);
                throw error;
            });
    }

    getDomainCount(): Promise<number> {
        return this.domainService.getDomainCount()
            .then(count => count)
            .catch(error => {
                console.error('Error fetching domain count:', error);
                throw error;
            });
    }
    getSubCategoryCount(): Promise<number> {
        return this.SubCategoryService.getSubCategoryCount()
            .then(count => count)
            .catch(error => {
                console.error('Error fetching sub category count:', error);
                throw error;
            });
    }


    processChartData(brandProductCounts: BrandProductsCountDTO[]) {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        console.log('Raw brand product counts:', brandProductCounts);

        const labels = brandProductCounts.map(item => item.brandName);
        const data = brandProductCounts.map(item => item.productCount);

        if (!labels.length || !data.length) {
            console.error('No data available for chart.');
            return;
        }

        const backgroundColors = data.map(() => `#${Math.floor(Math.random()*16777215).toString(16)}`);
        const borderColors = data.map(() => `#${Math.floor(Math.random()*16777215).toString(16)}`);

        this.chartData = {
            labels: labels,
            datasets: [
                {
                    label: 'Product Counts',
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    beginAtZero: true,
                    beginAtZero: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };

        this.changeDetectorRef.detectChanges();
    }

    processDomainChartData(domainProductCounts: DomainProductsCountDTO[]) {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        const labels = domainProductCounts.map(item => item.domainName);
        const data = domainProductCounts.map(item => item.productCount);

        if (!labels.length || !data.length) {
            console.error('No data available for domain chart.');
            return;
        }

        const backgroundColors = data.map(() => `#${Math.floor(Math.random()*16777215).toString(16)}`);
        const borderColors = data.map(() => `#${Math.floor(Math.random()*16777215).toString(16)}`);

        this.domainChartData = {
            labels: labels,
            datasets: [
                {
                    label: 'Domain Product Counts',
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1
                }
            ]
        };

        this.domainChartOptions = this.chartOptions; // Assuming chartOptions are similar for simplicity

        this.changeDetectorRef.detectChanges();
    }

    processCategoryChartData(categoryBrandCounts: any[]) {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        const labels = categoryBrandCounts.map(item => item.categoryName);
        const data = categoryBrandCounts.map(item => item.brandsCount);

        if (!labels.length || !data.length) {
            console.error('No data available for category chart.');
            return;
        }

        const backgroundColors = data.map(() => `#${Math.floor(Math.random()*16777215).toString(16)}`);
        const borderColors = data.map(() => `#${Math.floor(Math.random()*16777215).toString(16)}`);

        this.categoryChartData = {
            labels: labels,
            datasets: [
                {
                    label: 'Category Brand Counts',
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1
                }
            ]
        };

        this.categoryChartOptions = this.chartOptions; // Assuming chartOptions are similar for simplicity

        this.changeDetectorRef.detectChanges();
    }

    processUserChartData(usersOverTimeCounts: any[]) {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        const labels = usersOverTimeCounts.map(item => item.date);
        const data = usersOverTimeCounts.map(item => item.userCount);

        if (!labels.length || !data.length) {
            console.error('No data available for user chart.');
            return;
        }

        const backgroundColors = data.map(() => `#${Math.floor(Math.random()*16777215).toString(16)}`);
        const borderColors = data.map(() => `#${Math.floor(Math.random()*16777215).toString(16)}`);

        this.userChartData = {
            labels: labels,
            datasets: [
                {
                    label: 'User Counts Over Time',
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1
                }
            ]
        };

        this.userChartOptions = this.chartOptions; // Assuming chartOptions are similar for simplicity

        this.changeDetectorRef.detectChanges();
    }
    async initChart() {
        // Ensure the chart is updated/redrawn as needed
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
