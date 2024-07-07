import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { SearchService } from 'src/app/services/search.service';


import { MenuItem } from 'primeng/api';
import { CategoryService } from '../../services/category.service';
import { Category, SubCategory } from '../../models/category';
import { MenubarModule } from 'primeng/menubar';


@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, IconFieldModule, InputIconModule, InputTextModule, MenubarModule],
    
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent {
    isAuthenticated: boolean = false;
    headerBtn: HTMLElement;
    headerNav: HTMLElement;
    header: HTMLElement;
    menuItems: MenuItem[] = [];

    private sharedSearchService: SearchService
    
    constructor(private categoryService: CategoryService, private router: Router,private search:SearchService) { } 

    navigateToSearch(query: string) {
        if (query !== '') {
            this.search.updateSearchQuery(query);
            this.router.navigate(['/search-details'], {
                queryParams: { q: query,page:1 },
            });
        }
    }


  ngOnInit(): void {
    this.headerBtn = document.querySelector('.header__btn') as HTMLElement;
    this.headerNav = document.querySelector('.header__menu') as HTMLElement;
    this.header = document.querySelector('.header') as HTMLElement;

    this.toggleHeaderActive(); // Initial call on component initialization

    // Event listeners
    this.headerBtn.addEventListener('click', () => this.toggleHeaderMenu());
    window.addEventListener('scroll', () => this.toggleHeaderActive());

    this.categoryService.getAllCategories().subscribe(categories => {
      console.log(categories);
      this.menuItems = categories.map(category => ({
        label: category.name_Global,
        items: category.subCategories.map(subcategory => ({
          label: subcategory.name_Global,
          routerLink: ['/some-path', subcategory.id]
        }))
      }));
    });
  }

  toggleHeaderMenu(): void {
    this.headerBtn.classList.toggle('header__btn--active');
    this.headerNav.classList.toggle('header__menu--active');
  }

  toggleHeaderActive(): void {
    this.header.classList.toggle('header--active', window.scrollY > 0);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.toggleHeaderActive();
  }

}
