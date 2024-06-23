import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditProfileComponent } from './edit-profile.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: EditProfileComponent }
	])],
	exports: [RouterModule]
})
export class EditProfileRoutingModule { }
