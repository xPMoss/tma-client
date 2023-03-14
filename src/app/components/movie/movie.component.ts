// Angular
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

// rxjs
import { Observable, throwError, map, Subscription, BehaviorSubject } from 'rxjs';
import { catchError, retry, switchMap  } from 'rxjs/operators';

// Services
import { MovieService } from "../../shared/services/movie.service";
import { TmdbService } from "../../shared/services/tmdb.service";
import { MsgService } from "../../shared/services/msg.service";

// Models
import { Movie, Country, ReleaseDate, Certification, Genre, Keyword } from "../../shared/models/movie.model";
import { List } from "../../shared/models/list.model";

@Component({
  selector: 'movie-component',
  templateUrl: './movie.component.html',
  styles: [`
    .star {
      font-size: 1.5rem;
      color: rgb(200,200,200);
      
    }
    .filled {
      color: rgb(100,100,100);
    }
    .bad {
      color: rgb(200,200,200);
    }
    .filled.bad {
      color: rgb(250,100,100);
    }
  `]
})
export class MovieComponent {
    title = 'Movies';
    debug:boolean = false;

    showDetails:boolean = false;
    
    constructor(public tmdb:TmdbService, public ms:MovieService, private msg:MsgService){
      if(this.debug)console.log("MovieComponent()") // DEBUGGING



    }

    ngOnInit(){
      if (this.ms.cMovies.length < 1) {
        this.ms.loadUserMovies();
        
      }
      

    }


    







}
