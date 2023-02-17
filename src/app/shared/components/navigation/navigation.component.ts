// Angular
import { Component } from '@angular/core';

import { AuthService } from "../../services/auth.service";


// Bootstrap
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';


// rxjs
import { Observable } from 'rxjs';


import { MovieService } from "../../services/movie.service";


@Component({
  selector: 'navigation-component',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent {
  title = 'navigation-component';

  public isMenuCollapsed = true;

  public page:string;
  
  constructor( public authService: AuthService, public ms:MovieService ){
    


  }


  ngOnInit() {

  }






}
