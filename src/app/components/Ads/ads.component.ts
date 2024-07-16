import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { PaidAdService } from 'src/app/services/paid-ads.service';
import { PaidAd } from 'src/app/models/paidAd';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';

interface ExpandedRows {
    [key: string]: boolean;
}

@Component({
    selector: "app-ads",
    templateUrl: './ads.component.html',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FileUploadModule,
        ReactiveFormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        InputTextModule,
        DialogModule
    ],
    providers: [MessageService, PaidAdService],
    styles: [`.error-message {
    color: red;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}
    .ad-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.field {
    display: flex;
    flex-direction: column;
}

.error-message {
    color: red;
    font-size: 0.9rem;
}

.dialog-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
}

`]
})
export class AdsComponent implements OnInit {

    ads: PaidAd[] = [];
    ad: PaidAd = {} as PaidAd;
    selectedAds: PaidAd[] = [];
    expandedRows: ExpandedRows = {};
    deleteAdDialog: boolean = false;
    adDialog: boolean = false; // Control visibility of the add/edit dialog
    adForm: FormGroup; // Reactive form for add/edit

    cols: any[] = [];
    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private messageService: MessageService,
        private router: Router,
        private paidAdsService: PaidAdService,
        private fb: FormBuilder
    ) {
        this.adForm = this.fb.group({
            productName: ['', Validators.required],
            contact: ['', Validators.required],
            cost: [null, Validators.required],
            productPrice: [null, Validators.required],
            productImage: [''],
            productLink: ['', [Validators.required, Validators.pattern('https?://.+')]],
            startDate: ['', Validators.required],
            days: [null, [Validators.required, Validators.min(1)]]
        });
    }

    ngOnInit() {
        this.paidAdsService.getPaidAds().subscribe({
            next: (response: PaidAd[]) => {
                this.ads = response;
            }
        });

        this.cols = [
            { field: 'contact', header: 'Contact' },
            { field: 'cost', header: 'Cost' },
            { field: 'startDate', header: 'Start Date' },
            { field: 'endDate', header: 'End Date' },
            { field: 'productName', header: 'Product Name' },
            { field: 'productImage', header: 'Image' },
            { field: 'productPrice', header: 'Price' },
            { field: 'productLink', header: 'URL' },
            { field: 'actions', header: 'Actions' }
        ];
    }

    openNew() {
        this.router.navigate(['/admin/products/add-product/add']);
    }

    deleteSelectedAds() {
        // Add logic to delete selected ads
    }

    deleteAd(ad: PaidAd) {
        // Add logic to delete a single ad
    }

    confirmDeleteSelected() {
        const selectedAdIds = this.selectedAds.map(ad => ad.id);
        // Add logic to bulk delete ads by selectedAdIds
    }

    deleteAdDialogShow(ad: PaidAd) {
        this.ad = { ...ad };
        this.deleteAdDialog = true;
    }

    confirmDelete() {
        this.paidAdsService.deletePaidAd(this.ad.id).subscribe({
            next: () => {
                this.ads = this.ads.filter(val => val.id !== this.ad.id);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Ad Deleted', life: 3000 });
                this.ad = {} as PaidAd;
                this.deleteAdDialog = false;
            },
            error: (err) => console.error(err)
        });
    }

    hideDialog() {
        this.deleteAdDialog = false;
    }

    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.ads.length; i++) {
            if (this.ads[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    expandAll() {
        // Logic to expand all rows
    }

    onRowToggle(event: any, ad: PaidAd) {
        this.expandedRows[ad.id] = event.data;
    }

    formatCurrency(value: number) {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    clear(table: Table) {
        table.clear();
        (document.getElementById('globalFilter') as HTMLInputElement).value = '';
    }

    openAdDialog(ad?: PaidAd) {
        this.ad = ad ? { ...ad } : {} as PaidAd;
        this.adForm.reset(); // Reset the form
        if (ad) {
            this.adForm.patchValue(ad); // Fill form with ad details
            const startDate = new Date(ad.startDate);
            const endDate = new Date(ad.endDate);
            const timeDiff = endDate.getTime() - startDate.getTime();
            const days = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Calculate days
    
            // Set the calculated days in the form control
            this.adForm.patchValue({ days }); // Update the days field in the form
        }
        this.adDialog = true;
    }
    

    hideAdDialog() {
        this.adDialog = false;
    }

    saveAd() {
        if (this.adForm.invalid) {
            return; // Exit if form is invalid
        }
    
        const adData = this.adForm.value;
        const endDate = new Date(adData.startDate);
        endDate.setDate(endDate.getDate() + adData.days); // Calculate end date based on days
    
        if (this.ad.id) {
            // Update existing ad
            this.paidAdsService.updatePaidAd({ ...this.ad, ...adData, endDate: endDate.toISOString().split('T')[0] }).subscribe({
                next: () => {
                    // Update the local ads array with the new data
                    this.ads[this.findIndexById(this.ad.id)] = { ...this.ad, ...adData, endDate: endDate.toISOString().split('T')[0] }; 
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Ad Updated', life: 3000 });
                    this.adDialog = false;
                },
                error: (err) => console.error(err)
            });
        } else {
            // Create new ad
            adData.endDate = endDate.toISOString().split('T')[0]; // Set calculated end date
            this.paidAdsService.addPaidAd(adData).subscribe({
                next: (newAd) => {
                    this.ads.push(newAd);
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Ad Created', life: 3000 });
                    this.adDialog = false;
                },
                error: (err) => console.error(err)
            });
        }
    }
    
}
