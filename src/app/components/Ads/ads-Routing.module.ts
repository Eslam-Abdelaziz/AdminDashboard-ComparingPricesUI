import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdsComponent } from './ads.component';


@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: AdsComponent }
  ])],
  exports: [RouterModule]
})
export class AdsComponentRoutingModule { }
