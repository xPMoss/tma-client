import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { Prefs, Settings } from 'src/app/shared/models/user.model';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

  page:string = "settings";
  ages:number[] = [7,9,11,13,16,18];

  pages:HTMLElement[] = [];

  promptVisible:boolean = false;

  dBody:HTMLElement = document.body;
  sidenav:HTMLElement;
  sidenavlist:HTMLElement;
  footer:HTMLElement;

  isInline:boolean = false;


  constructor(public authService: AuthService, public us:UserService) {
    window.addEventListener("resize", (event) => {
      
    });

    
    
  }

  ngOnInit() {
    this.nav(this.page)

    

  }

  ngAfterViewChecked(){


  }

  setAge(event){
    console.log(event.target.value);

    this.authService.user.settings.ageRating = Number(event.target.value);

    this.us.setItem(this.authService.user)

  }



  setH(){



    

  }

  nav(page){
    this.pages = [];

    this.pages.push(document.getElementById("profile"))
    this.pages.push(document.getElementById("settings"))

    for (const el of this.pages) {
      el.classList.remove('bg-primary')
      el.classList.remove('text-white')
      el.style.cursor = "pointer"

      if (el.id == page) {
        el.classList.add('bg-primary')
        el.classList.add('text-white')
        el.style.cursor = "auto"
      }
      //el.classList.remove('active')
    }

    this.page = page;


  }

  isIterable(input) {  
    if (input === null || input === undefined) {
      return false
    }
  
    return typeof input[Symbol.iterator] === 'function'
  }


  promptSignOut(){
    this.promptVisible = true;


    
    
  }

  signOut(answer){

    this.promptVisible = false;

    if (answer == "y") {
      this.authService.SignOut();
    }
    
    
  }


}