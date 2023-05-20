// Angular
import { Component, OnInit, Input } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { Location } from '@angular/common';

// rxjs
import { Observable, throwError, map, Subscription, BehaviorSubject } from 'rxjs';
import { catchError, retry, switchMap  } from 'rxjs/operators';

// Services
import { MovieService } from "../../shared/services/movie.service";
import { TmdbService } from "../../shared/services/tmdb.service";
import { DiscoverService } from "../../shared/services/discover.service";

import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';

// Models
import { Movie, Country, ReleaseDate, Certification, Genre, Keyword } from "../../shared/models/movie.model";
import { List } from "../../shared/models/list.model";
import { Filter } from "../../shared/models/filter.model";

import { genres as genresdb } from 'src/assets/db';

@Component({
  selector: 'discover-component',
  templateUrl: './discover.component.html',
 
})

export class DiscoverComponent {

  isLoggedIn:boolean = false;

  public genresdb = genresdb;

  constructor(
    public tmdb:TmdbService, 
    public ms:MovieService, 
    public location: Location, 
    public ds:DiscoverService,
    public auth:AuthService,
    
    ){
    
  }

  ngOnInit() {
    this.isLoggedIn = this.auth.isLoggedIn;
    this.ds.reset();

   
  }


  ngOnDestroy(){
    console.log(this.constructor.name + ".ngOnDestroy()")
    this.ds.reset();

  }



}
