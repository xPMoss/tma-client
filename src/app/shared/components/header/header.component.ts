import { Component, Input, Output } from '@angular/core';
import { Data, NavigationEnd, RouterModule, Router } from '@angular/router';

import { Observable, map, filter } from 'rxjs';


import { Location } from '@angular/common';



@Component({
  selector: 'header-component',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
    title:string = '';


    constructor(public location:Location, private router: Router){

      this.router.events.pipe( 
        // Filter the NavigationEnd events as the breadcrumb is updated only when the route reaches its end 
        // Filter the NavigationEnd events as the breadcrumb is updated only when the route reaches its end 
        filter((event) => event instanceof NavigationEnd) 
      ).subscribe(event => { 
        // Construct the breadcrumb hierarchy 
        const route = this.router.routerState.snapshot.root; 

        let children = route.children;

        this.title = "";

        for (let i = 0; i < children.length; i++) {
          let child = children[i];
          
          let obj = child.data;

          this.title += child.data['title'];
          
        }

       

      }); 
    }
    
    ngOnInit(){
     
    }


    ngOnChanges(){
      console.log("CHANGE!!!")
    }
    
}
