import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { BrandService } from '../../services/brand.service';
import { Brand, Category } from '../../models/Brand';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [CommonModule, HttpClientModule, TableModule, ButtonModule, DialogModule, InputTextModule, FormsModule, ToastModule, ToolbarModule],
  providers: [MessageService],
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {
  brands: Brand[] = [];
  expandedRows: { [key: string]: boolean } = {};
  isExpanded = false;
  loading = true;

  brandDialog: boolean = false;
  deleteBrandDialog: boolean = false;
  deleteBrandsDialog: boolean = false;

  brand: Brand = { id: 0, name_Local: '', name_Global: '', description_Local: '', description_Global: '', logo: '', categories: [] };
  selectedBrands: Brand[] = [];
  submitted: boolean = false;

  constructor(private brandService: BrandService, private messageService: MessageService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.brandService.getBrands().subscribe(brands => {
      this.brands = brands;
      this.loading = false;
    });
  }

  expandAll() {
    if (!this.isExpanded) {
      this.brands.forEach(brand => {
        if (brand && brand.name_Local) {
          this.expandedRows[brand.name_Local] = true;
        }
      });
    } else {
      this.expandedRows = {};
    }
    this.isExpanded = !this.isExpanded;
  }

  getCategories(brand: Brand): Category[] {
    return brand.categories || [];
  }

  openNew() {
    this.brand = { id: 0, name_Local: '', name_Global: '', description_Local: '', description_Global: '', logo: '', categories: [] };
    this.submitted = false;
    this.brandDialog = true;
  }

  editBrand(brand: Brand) {
    this.brand = { ...brand };
    this.brandDialog = true;
  }

  deleteBrand(brand: Brand) {
    this.deleteBrandDialog = true;
    this.brand = { ...brand };
  }

  confirmDelete() {
    this.deleteBrandDialog = false;
    this.brandService.deleteBrand(this.brand.id).subscribe({
      next: () => {
        this.loadData();
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Brand Deleted', life: 3000 });
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to Delete Brand', life: 3000 });
      }
    });
  }

  deleteSelectedBrands() {
    this.deleteBrandsDialog = true;
  }

  confirmDeleteSelected() {
    this.deleteBrandsDialog = false;
    const deleteRequests = this.selectedBrands.map(brand =>
      this.brandService.deleteBrand(brand.id).toPromise()
    );

    Promise.all(deleteRequests).then(() => {
      this.loadData();
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Selected Brands Deleted', life: 3000 });
    }).catch(error => {
      console.error(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to Delete Selected Brands', life: 3000 });
    }).finally(() => {
      this.selectedBrands = [];
    });
  }

  saveBrand() {
    this.submitted = true;
    if (this.brand.name_Local.trim()) {
      if (this.brand.id) {
        this.brandService.updateBrand(this.brand).subscribe({
          next: () => {
            this.loadData();
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Brand Updated', life: 3000 });
          },
          error: (err) => {
            console.error(err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to Update Brand', life: 3000 });
          }
        });
      }
      this.brandDialog = false;
      this.brand = { id: 0, name_Local: '', name_Global: '', description_Local: '', description_Global: '', logo: '', categories: [] };
    }
  }

  hideDialog() {
    this.brandDialog = false;
    this.submitted = false;
  }
}
