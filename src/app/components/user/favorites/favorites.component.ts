import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { PaginatorModule } from 'primeng/paginator';
import { NgFor } from '@angular/common';
import { FavProduct } from 'src/app/models/FavProduct';
import { UsersService } from 'src/app/services/users.service';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, CardModule, ToolbarModule, NgFor, PaginatorModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  FavProd: FavProduct[] = [];
  paginatedFavProd: FavProduct[] = [];
  id: string;
  first = 0;
  rows = 10;
  totalRecords: number;

  constructor(private userServ: UsersService, private authServ: AuthService) {}

  ngOnInit(): void {
    this.id = this.authServ.GetUserData().uid;
    this.userServ.GetFavouriteroduct(this.id).subscribe({
      next: (res: FavProduct[]) => {
        this.FavProd = res;
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
    this.paginatedFavProd = this.FavProd.slice(start, end);
  }
}
