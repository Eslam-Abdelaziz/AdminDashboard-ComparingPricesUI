import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, HostListener, ChangeDetectorRef, OnInit, AfterViewInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { SearchService } from 'src/app/services/search.service';
import { MenuItem } from 'primeng/api';
import { CategoryService } from '../../services/category.service';
import { Category, SubCategory } from '../../models/category';
import { MenubarModule } from 'primeng/menubar';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { HeaderService } from 'src/app/services/header.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        CommonModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        MenubarModule,
        RouterLink,
        TranslateModule,
        MenuModule,
        ButtonModule
    ],

    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, AfterViewInit{
    //properties
    isAuthenticated: boolean = false;
    headerBtn: HTMLElement;
    headerNav: HTMLElement;
    header: HTMLElement;
    tieredItems: MenuItem[] = [];
    categories: Category[] = [];
    tenant: string = "1";

    //injection
    private sharedSearchService: SearchService;

    constructor(
        private cdr:ChangeDetectorRef,
        private categoryService: CategoryService,
        private authService: AuthService,
        private router: Router,
        private search: SearchService,
        private translate: TranslateService,
        private headerService: HeaderService
    ) {
        this.currentLang = localStorage.getItem('language') ?? 'en';
        this.translate.use(this.currentLang);
    }

    //life cycle
    ngOnInit(): void {
        this.getTenant();
        this.categoryService.getAllCategories().subscribe((categories) => {
            this.categories = categories;
            this.tieredItems = categories.map((category) => ({
                label: category.name_Global,
                items: category.subCategories.map((subcategory) => ({
                    label: subcategory.name_Global,
                    routerLink: ['/some-path', subcategory.id],
                })),
            }));
        });
        if (localStorage.getItem('UserToken') != null) {
            this.isAuthenticated = true;
        }
    }
    ngAfterViewInit(): void {
        this.headerBtn = document.querySelector('.header__btn') as HTMLElement;
        this.headerNav = document.querySelector('.header__menu') as HTMLElement;
        console.log("header navbar is:", this.headerNav)
        this.header = document.querySelector('.header') as HTMLElement;

        this.toggleHeaderActive(); // Initial call on component initialization

        // Event listeners
        this.headerBtn.addEventListener('click', () => this.toggleHeaderMenu());
        window.addEventListener('scroll', () => this.toggleHeaderActive());
    }

    //methods
    changeTenant(tenant: string) {
        this.headerService.changeTenant(tenant);
    }
    getTenant(): void {
        this.headerService.getTenant().subscribe((tenant) => {
            this.tenant = tenant;
        })
    }
    navigateToSearch(query: string) {
        if (query !== '') {
            this.search.updateSearchQuery(query);
            this.router.navigate(['/search-details'], {
                queryParams: { q: query, page: 1 },
            });
        }
    }

    toggleHeaderMenu(): void {
        this.headerBtn.classList.toggle('header__btn--active');
        this.headerNav.classList.toggle('header__menu--active');
    }

    toggleHeaderActive(): void {
        this.header.classList.toggle('header--active', window.scrollY > 0);
    }

    scrollToSection(sectionId: string) {
        debugger;
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        this.toggleHeaderActive();
    }

    logout(event: Event) {
        this.authService.logout();
        event.stopPropagation();
    }

    currentLang!: string;

    switchLanguage() {
        window.location.reload();
        this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
        this.translate.use(this.currentLang);
        localStorage.setItem('language', this.currentLang);
    }
}
