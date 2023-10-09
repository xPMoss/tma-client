// Angular
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

// rxjs
import { Observable, throwError, map, Subscription, BehaviorSubject } from 'rxjs';

// Services
import { MovieService } from "../../shared/services/movie.service";
import { TmdbService } from "../../shared/services/tmdb.service";
import { MsgService } from "../../shared/services/msg.service";
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';

// Models
import { Movie, Country, ReleaseDate, Certification, Genre, Keyword } from "../../shared/models/movie.model";
import { List } from "../../shared/models/list.model";
import { FirebaseMovie } from '../../shared/models/firebase.model';
import { TmdbMovie } from 'src/app/shared/models/tmdb.model';

@Component({
  selector: 'movie-component',
  templateUrl: './movies.component.html',
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
    
    showMoviesAs:string = "poster";
    showMoviesAsOptions:string[] = ["poster", "list"];

    movies:Movie[] = [];
    firebaseMovies:FirebaseMovie[];

    constructor(public tmdb:TmdbService, public ms:MovieService, private msg:MsgService, public authService: AuthService, public us:UserService){
      if(this.debug)console.log("MovieComponent()") // DEBUGGING

      


    }

    ngOnInit(){
      
      this.getMovies()

      if (this.ms.cMovies.length < 1) {
        //this.ms.loadUserMovies();
        
      }

    }

    async getMovies() {

      this.ms.MoviesFirebase$().subscribe( (dataFb:FirebaseMovie[]) => {

        this.firebaseMovies = dataFb;
        
        // Get details
        this.firebaseMovies.forEach( async (movieFb) => {
          let id = movieFb.id

          let movieTmdb:TmdbMovie = await this.tmdb.getDetailsTmdb(id);
          let images = await this.tmdb.getImagesTmdb(id);

          // Combine data
          let movie = { ...movieFb, ...movieTmdb, ...images, ...(new Movie()) };

          this.movies.push( movie );
          console.log( movie )

        })



      })
  
  
    }

    showAsSelection(event){
      console.log(event.target.value);

      this.authService.user.prefs.showMoviesAs = event.target.value.toLowerCase();
  
      this.us.setItem(this.authService.user)

    }


    







}
