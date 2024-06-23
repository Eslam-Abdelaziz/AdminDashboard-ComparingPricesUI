import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserLayoutComponent } from './user-layout.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: UserLayoutComponent }
	])],
	exports: [RouterModule]
})
export class UserRoutingModule { }
