    import { HttpClient } from '@angular/common/http';
    import { Injectable, OnInit } from '@angular/core';
    import { RegisterUser } from '../models/register-user';
    import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

    @Injectable({
    providedIn: 'root'
    })
    export class AuthService implements OnInit {

    UserData : any
    Email:String
    Password:string

    BaseUrl:string ='http://localhost:5066/api/Account/'
    constructor(private httpclient:HttpClient,private router:Router) { }
    ngOnInit(): void {

    }
    Register(User:object){
        return this.httpclient.post(this.BaseUrl+'register',User)
    }

    Login(User:object){
        return this.httpclient.post(this.BaseUrl+'login',User)
    }

    GetUserData(){
        let encodeToken = localStorage.getItem('UserToken')
        if(encodeToken!=null){
        this.UserData=jwtDecode(encodeToken)
        //console.log(this.UserData)
        }
        return this.UserData
    }

    logout(){
        localStorage.removeItem('UserToken')
        this.router.navigate(['/login'])
    }


    }
