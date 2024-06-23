import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { Country } from 'src/app/models/Country';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { CountryJson } from '../../register/Country';


@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    InputTextModule,
    FormsModule,
    DropdownModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent {
    minDate: string;
    messageError: string;
    Userid: string = ''



    selectedGender: string;
    id: string;
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
    Counteries: Country[] = [];
    selectedCountry: Country;
    CountryName:string[]
    countryCode: string = '';

    handleForm() {
        this.Userid=this.authServ.GetUserData().uid
        //console.log(this.registerForm.value)
        this.user.country = this.registerForm.value.country.name
        this.user.firstName = this.registerForm.value.firstName
        this.user.lastName = this.registerForm.value.lastName
        this.user.userName = this.registerForm.value.userName
        this.user.email = this.registerForm.value.email
        this.user.gender = this.registerForm.value.gender
        this.user.dateOfBirth = this.registerForm.value.dateOfBirth
        this.user.phoneNumber = this.registerForm.value.phoneNumber
        this.user.phoneCode = this.registerForm.value.phoneCode


        this.userServ.UpdateUserData(this.registerForm.value,this.Userid).subscribe({
            next : res =>{
                console.log(res)
                console.log('sucess')
                this.route.navigateByUrl('user/profile')
            },
            error  : err=>{
                this.messageError=err.error
                console.log(this.registerForm.value)
                console.log('error',err)}
        })
    }


    registerForm: FormGroup = new FormGroup({
        userName: new FormControl(null, [Validators.required, Validators.maxLength(40)]),
        firstName: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
        lastName: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
        email: new FormControl(null, [Validators.required, Validators.email]),
        gender: new FormControl(null, [Validators.required, Validators.maxLength(10)]),
        country: new FormControl(null, [Validators.required]),
        phoneCode: new FormControl(null),
        phoneNumber: new FormControl(null, [Validators.pattern(/^1[1205][0-9]{8}$/)]),
        dateOfBirth: new FormControl(null)
    });

    genderOptions = [
        { label: 'Female', value: 'female' },
        { label: 'Male', value: 'male' },
    ];

    constructor(private userServ: UsersService, private authServ: AuthService, private route: Router) {
        const _today = new Date();
    const thirteenYearsAgo = new Date(_today.setFullYear(_today.getFullYear() - 13));
    this.minDate = thirteenYearsAgo.toISOString().split('T')[0];const today = new Date();
    }

    ngOnInit(): void {
        let countryString = JSON.stringify(CountryJson);
        this.Counteries = JSON.parse(countryString) as Country[];
        this.CountryName=this.Counteries.map(a=>a.name)
        this.id = this.authServ.GetUserData().uid;

        this.userServ.getUserById(this.id).subscribe({
            next: (res: User) => {
                this.user = res;
                this.selectedCountry = this.Counteries.find(country => country.name === this.user.country);
                this.registerForm.patchValue(this.user);
                //this.registerForm.patchValue({ country: this.selectedCountry });
            }
        });


    }
    onCountryChange(value: any) {
       // this.selectedCountry = event.value;
        //this.registerForm.get('phoneCode')?.setValue(this.Counteries.find(a=>a.name==this.selectedCountry.name).dial_code)

        const selectedCountry = this.Counteries.find(a => a.name == value);
    if (selectedCountry) {
      this.countryCode = selectedCountry.dial_code;
      this.registerForm.get('country')?.setValue(selectedCountry.name);
      this.registerForm.get('phoneCode')?.setValue(selectedCountry.dial_code);
    }

    }
}
