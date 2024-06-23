import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AddProductComponent } from './components/ProductDashboard/add-product/add-product.component';
import { StepsMenuComponent } from './components/steps-menu/steps-menu.component';
import { ConfirmProductComponent } from './components/ProductDashboard/confirm-product/confirm-product.component';
import { ProductImagesComponent } from './components/ProductDashboard/product-images/product-images.component';
import { ReviewProductComponent } from './components/ProductDashboard/review-product/review-product.component';
import { UserLayoutComponent } from './components/user/user-layout/user-layout.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: '', redirectTo: 'admin/dashboard', pathMatch: 'full' },
            {
                path: 'admin', component: AppLayoutComponent,
                children: [
                    { path: '', loadChildren: () => import('../app/components/dashboard/dashboard-routing.module').then(m => m.DashboardsRoutingModule) },
                    { path: 'dashboard', loadChildren: () => import('../app/components/dashboard/dashboard-routing.module').then(m => m.DashboardsRoutingModule) },
                    { path: 'uikit', loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UIkitModule) },
                    { path: 'utilities', loadChildren: () => import('./demo/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
                    { path: 'documentation', loadChildren: () => import('./demo/components/documentation/documentation.module').then(m => m.DocumentationModule) },
                    { path: 'blocks', loadChildren: () => import('./demo/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
                    { path: 'pages', loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule) },
                    { path: 'products', loadChildren: () => import('../app/components/products/products-routing.module').then(m => m.ProductsRoutingModule) },
                    { path: 'products/add-product',
                        component: StepsMenuComponent,
                        children: [
                            { path: 'add', component: AddProductComponent },
                            { path: 'review', component: ReviewProductComponent },
                            { path: 'confirm', component: ConfirmProductComponent },
                            { path: 'images', component: ProductImagesComponent },
                        ], 
                    },
                    { path: 'categories',loadChildren: () => import('../app/components/catagory/category-routing.module').then(m => m.CategoryRoutingModule)},
                    { path: 'brands',loadChildren: () => import('./components/brands/brands-routing.module').then(m => m.BrandsRoutingModule)},
                    { path: 'users',loadChildren: () => import('./components/users/user-routing.module').then(m => m.UserRoutingModule)},
                    { path: 'admins',loadChildren: () => import('./components/admins/admin-routing.module').then(m => m.AdminRoutingModule)},

                ]
            },
            { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
            { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
            { path: 'home', component: HomeComponent },
            { path: 'register',component:RegisterComponent},
            { path: 'login',component:LoginComponent},
            { path: 'user', component :UserLayoutComponent,
                children:[
                {
                    path: 'profile', loadChildren: () => import('../app/components/user/profile/Profile-routing.module').then(m => m.UserRoutingModule)},
                    { path: 'profile/edit', loadChildren: () => import('../app/components/user/edit-profile/Profile-routing.module').then(m => m.EditProfileRoutingModule),
                },
                {
                    path: 'favorites', loadChildren: () => import('../app/components/user/favorites/Favourite-routing.module').then(m => m.FavRoutingModule)
                },
                {
                    path: 'history', loadChildren: () => import('../app/components/user/history/History-routing.module').then(m => m.HisRoutingModule)
                },
                {
                    path: 'alerts', loadChildren: () => import('../app/components/user/alerts/Alert-routing.module').then(m => m.AlertRoutingModule)
                },
            ] },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },


        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
