import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from '../../layout/app.layout.component';
import { StepsMenuComponent } from '../../components/steps-menu/steps-menu.component';
import { AddProductComponent } from '../../components/ProductDashboard/add-product/add-product.component';
import { ReviewProductComponent } from '../../components/ProductDashboard/review-product/review-product.component';
import { ConfirmProductComponent } from '../../components/ProductDashboard/confirm-product/confirm-product.component';
import { ProductImagesComponent } from '../../components/ProductDashboard/product-images/product-images.component';

const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: '', loadChildren: () => import('../../components/dashboard/dashboard-routing.module').then(m => m.DashboardRoutingModule) },
      { path: 'dashboard', loadChildren: () => import('../../components/dashboard/dashboard-routing.module').then(m => m.DashboardRoutingModule) },
      { path: 'products', loadChildren: () => import('../../components/products/products-routing.module').then(m => m.ProductsRoutingModule) },
      {
        path: 'products/add-product', component: StepsMenuComponent,
        children: [
          { path: 'add', component: AddProductComponent },
          { path: 'review', component: ReviewProductComponent },
          { path: 'confirm', component: ConfirmProductComponent },
          { path: 'images', component: ProductImagesComponent },
        ],
      },
      { path: 'categories', loadChildren: () => import('../../components/category/category-routing.module').then(m => m.CategoryRoutingModule) },
    //   { path: 'brands', loadChildren: () => import('../../components/brands/brands-routing.module').then(m => m.BrandsRoutingModule) },
      { path: 'users', loadChildren: () => import('../../components/users/user-routing.module').then(m => m.UserRoutingModule) },
      { path: 'admins', loadChildren: () => import('../../components/admins/admin-routing.module').then(m => m.AdminRoutingModule) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
