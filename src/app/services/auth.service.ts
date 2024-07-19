import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { RegisterUser } from '../models/register-user';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {

    UserData : any
    Email:String
    Password:string

    BaseUrl:string = environment.api + '/Account/';

    constructor(private httpclient:HttpClient,private router:Router) { }
    ngOnInit(): void {

    }
    Register(User:object){
        return this.httpclient.post(this.BaseUrl+'register',User)
    }

    Login(User: { email: string, password: string }) {
        const params = { email: User.email, password: User.password };
        return this.httpclient.get(this.BaseUrl + 'Login', { params, responseType: 'text' });
    }

  GetUserData() {
    let encodeToken = localStorage.getItem('UserToken');
    if (encodeToken != null) {
      this.UserData = jwtDecode(encodeToken);
    }
    return this.UserData;
  }

  logout() {
    localStorage.removeItem('UserToken');
    window.location.href = '/home';
   // this.router.navigate(['/home']);
  }
}
