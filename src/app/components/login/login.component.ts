import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {
    StrongPasswordRegx: RegExp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{12,}$/;
    EmailRegex: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    messageError: string = '';
    show: boolean = false;
    loginForm: FormGroup;
    @ViewChild('animate') animateText!: ElementRef;
    formNotValid: boolean = false;

    constructor(private authService: AuthService, private _router: Router) { }

    ngOnInit(): void {
        const navigation = this._router.getCurrentNavigation();
        let email = this.authService.Email;
        let password = this.authService.Password;

        if (navigation?.extras.state) {
            const state = navigation.extras.state as { email: string; password: string };
            email = state.email;
            password = state.password;
        }

        this.loginForm = new FormGroup({
            email: new FormControl(email, [Validators.required, Validators.email]),
            password: new FormControl(password, [Validators.required])
        });
    }

    ngAfterViewInit() {
        // this.animate();
    }

    handleForm() {
        debugger
        if (this.loginForm.valid) {
            this.authService.Login(this.loginForm.value).subscribe({
                next: (response: any) => {
                    const parsedResponse = JSON.parse(response);
                    if (parsedResponse.message === "Success") {
                        localStorage.setItem('UserToken', parsedResponse.token);
                        console.log(parsedResponse.roles);
                        if (parsedResponse.roles.includes('Admin') || parsedResponse.roles.includes('SuperAdmin')) {
                            this._router.navigate(['/admin']);
                        } else if (parsedResponse.roles.includes('User')) {
                            this._router.navigate(['/home']);
                        }
                        this.authService.GetUserData();
                    }
                },
                error: (err) => {
                    this.messageError = err.error;
                }
            });
        } else {
            this.formNotValid = true;
        }
    }

    animate() {
        const str = this.animateText.nativeElement.innerHTML.split(' ');
        let i = 0;
        const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#33FFF5'];
        this.animateText.nativeElement.innerHTML = "";

        const interval = setInterval(() => {
            if (i < str.length) {
                const wordSpan = document.createElement('span');
                wordSpan.innerHTML = (i === 0 ? '' : ' ') + str[i];
                wordSpan.style.color = colors[i % colors.length];
                this.animateText.nativeElement.appendChild(wordSpan);
                i++;
            } else {
                i = 0;
                this.animateText.nativeElement.innerHTML = "";
            }
        }, 500);
    }


    password() {
        this.show = !this.show;
    }
}
