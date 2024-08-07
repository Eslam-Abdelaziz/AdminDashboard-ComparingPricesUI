import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { PaginatorModule } from 'primeng/paginator';
import { NgFor } from '@angular/common';
import { FavProduct } from 'src/app/models/FavProduct';
import { UsersService } from 'src/app/services/users.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
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

  constructor(private userServ: UsersService, private authServ: AuthService,private _router: Router) {}

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

  RemoveItem(Prodid: number) {
    this.userServ.RemoveFavProduct(this.id,Prodid).subscribe({
        next : res=>{
            console.log(Prodid+'      '+this.id )
            console.log(res)
            this.userServ.GetFavouriteroduct(this.id).subscribe({
                next: (res: FavProduct[]) => {
                    this.FavProd = res;
                    console.log(this.FavProd)
                    this.totalRecords = res.length;
                    this.updatePaginatedProducts();
                }
                });
        },
        error :err=>console.log(err)
    })
}

getDetails(productId: number) {
    this._router.navigate([`productDetails/${productId}`]);
}
}
