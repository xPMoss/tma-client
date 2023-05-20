import { Component, OnInit } from '@angular/core';

// rjxs -->
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { AuthService } from "../../shared/services/auth.service";
import { Router } from '@angular/router';



@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  constructor( public authService: AuthService, public router: Router, ) { }

  ngOnInit(): void {

  }



  async signin(userName, userPassword){

    await this.authService.SignIn(userName.value, userPassword.value)

  
    
  }


  async GoogleAuth(){

    await this.authService.GoogleAuth()
    
  }

}
