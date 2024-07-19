import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClient } from '@angular/common/http';
import { UsersService } from 'src/app/services/users.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/User';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    InputTextModule,
    FormsModule,
    DropdownModule,
    TranslateModule,

  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
    export class ProfileComponent implements OnInit {
        value:String="Ahmed"
        selectedGender: string;
        id:string
        user: User = {
            firstName: '',
            lastName: '',
            userName: '',
            email: '',
            country: '',
            gender: '',
            phoneCode: '',
            phoneNumber: '',
            id: '',
            dateOfBirth: undefined
        };
        genderOptions = [
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' }
        ];
        constructor(private userServ:UsersService,private authServ:AuthService,private route: Router) {
        }
ngOnInit(): void {
    console.log(this.authServ.GetUserData().uid)
    this.id=this.authServ.GetUserData().uid
    this.userServ.getUserById(this.id).subscribe({
        next:(res:User)=>{
            this.user=res
            //console.log(this.user)
        }
    })
}

goToEdit(): void {
    this.route.navigate(['/user/profile/edit']);
    }
}
