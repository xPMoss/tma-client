// Angular
import { Component } from '@angular/core';
import { Data, NavigationEnd, RouterModule, Router } from '@angular/router';

// Services
import { AuthService } from "../../services/auth.service";


// Bootstrap
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';


// rxjs
import { Observable, map, filter } from 'rxjs';


import { MovieService } from "../../services/movie.service";


@Component({
  selector: 'navigation-component',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent {
  title = 'navigation-component';

  public isMenuCollapsed = true;

  public navItems:[] = [];

  public page:string;
  
  constructor( public authService: AuthService, public ms:MovieService, private router: Router ){
    

    this.navItems

    

  }


  ngOnInit() {
    this.router.events.pipe( 
      // Filter the NavigationEnd events as the breadcrumb is updated only when the route reaches its end 
      filter((event) => event instanceof NavigationEnd))
        .subscribe(event => { 
          // Construct the breadcrumb hierarchy 
          const route = this.router.routerState.snapshot.root; 

          let children = route.children;

          this.title = "";

          for (let i = 0; i < children.length; i++) {
            let child = children[i];
            
            let obj = child.data;

            this.page = child.data['title'];
            
          }

          let items = (document.querySelectorAll(".nav-item") as NodeListOf<HTMLElement>);
         
          for (let i = 0; i < items.length; i++) {
            let item = items[i];

            //console.log("item")
            //console.log(item)
 
            if (item.getAttribute("route")) {
              let link = (item.firstChild as HTMLElement);
              link.classList.remove("text-primary", "border-bottom", "border-primary");
              //link.classList.remove("px-2", "bg-primary", "text-light");
              link.style.border = "none"
              link.style.boxShadow = "none"

              if (item.getAttribute("route").toLowerCase() == this.page.toLowerCase()) {
                //link.classList.add("text-primary", "border-bottom", "border-primary");
                link.classList.add("text-primary", "border-bottom", "border-primary");
                //link.style.boxSizing = "border-box"
                //link.style.borderBottom = "2px solid var(--bs-dark)"
                //link.style.boxShadow = "inset 0px -2px 0px var(--bs-secondary)"
              }

            }
          
            //console.log(item.getAttribute("route"))
            //console.log(this.page)
          }

        }
    ); 

    



  }






}
