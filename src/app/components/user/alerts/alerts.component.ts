import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { ToolbarModule } from 'primeng/toolbar';
import { AlertProduct } from 'src/app/models/AlertProd';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, CardModule, ToolbarModule, NgFor, PaginatorModule],
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'] // Corrected styleUrls
})
export class AlertsComponent implements OnInit {
  AlertProd: AlertProduct[] = [];
  paginatedFavProd: AlertProduct[] = [];
  first = 0;
  rows = 10;
  totalRecords: number;
  id: string;

  constructor(private userServ: UsersService, private authServ: AuthService) { }

  ngOnInit(): void {
    this.id = this.authServ.GetUserData().uid;
    this.userServ.GetAlertroduct(this.id).subscribe({
      next: (res: AlertProduct[]) => {
        this.AlertProd = res;
        this.totalRecords = res.length;
        this.updatePaginatedProducts();
      }
    });
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.updatePaginatedProducts();
  }

  updatePaginatedProducts(): void {
    const start = this.first;
    const end = this.first + this.rows;
    this.paginatedFavProd = this.AlertProd.slice(start, end);
  }
}
