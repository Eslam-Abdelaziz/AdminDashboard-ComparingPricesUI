import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CountryJson } from './Country';
import { Country } from '../../models/Country';
import { RouterLink, Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'app-register',
    standalone: true,
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterLink, DropdownModule]
})

export class RegisterComponent implements OnInit {
    StrongPasswordRegx: RegExp = /^(?=.*[A-Z]).{8,}$/;
    EmailRegex: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    Counteries: Country[] = [];
    countryCode: string = '';
    messageError: string = ''
    show: boolean = false;
    minDate: string;
    formNotValid: boolean = false;



    registerForm: FormGroup = new FormGroup({
        userName: new FormControl(null, [Validators.required, Validators.maxLength(40)]),
        password: new FormControl(null, [Validators.required, Validators.pattern(this.StrongPasswordRegx)]),
        firstName: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
        lastName: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
        email: new FormControl(null, [Validators.required, Validators.email]),
        gender: new FormControl(null, [Validators.required, Validators.maxLength(10)]),
        country: new FormControl(null, [Validators.required, Validators.maxLength(30)]),
        phoneCode: new FormControl(null, [Validators.required]),
        phoneNumber: new FormControl(null, [Validators.required]),
        image: new FormControl(null),
        dateOfBirth: new FormControl(null)
    });

    constructor(private authService: AuthService, private _router: Router) {

        const _today = new Date();
        const thirteenYearsAgo = new Date(_today.setFullYear(_today.getFullYear() - 13));
        this.minDate = thirteenYearsAgo.toISOString().split('T')[0]; const today = new Date();

    }

    ngOnInit(): void {
        let countryString = JSON.stringify(CountryJson);
        this.Counteries = JSON.parse(countryString) as Country[];
        //console.log(this.Counteries);
    }

    handleForm() {
        if (this.registerForm.valid) {
            this.authService.Register(this.registerForm.value).subscribe({
                next: (response) => {
                    this._router.navigate(['/login'], { state: { email: this.registerForm.value.email, password: this.registerForm.value.password } });
                    //console.log(response);
                    this.authService.Email = this.registerForm.value.email
                    this.authService.Password = this.registerForm.value.password
                    //console.log(this.authService.Email)
                },
                error: (err) => {
                    //console.log(err);
                    //console.log(err.error)
                    this.messageError = err.error
                }
            });
        } else {
            this.formNotValid = true;
        }
    }

    onCountrySelected(value: string) {
        const selectedCountry = this.Counteries.find(a => a.name == value);
        if (selectedCountry) {
            this.countryCode = selectedCountry.dial_code;
            this.registerForm.get('country')?.setValue(selectedCountry.name);
            this.registerForm.get('phoneCode')?.setValue(selectedCountry.dial_code);
        }
    }

    password() {
        this.show = !this.show;
    }
}
