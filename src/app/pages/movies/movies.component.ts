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
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';

// Models
import { Movie, Country, ReleaseDate, Certification, Genre, Keyword } from "../../shared/models/movie.model";
import { List } from "../../shared/models/list.model";
import { FirebaseMovie } from '../../shared/models/firebase.model';
import { TmdbMovie } from 'src/app/shared/models/tmdb.model';
import { NewMovie } from "../../shared/models/movie.model";

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

    movies:NewMovie[] = [];
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

          let movie:TmdbMovie = await this.tmdb.getDetailsTmdb(movieFb.id);
          let mv = { ...movieFb, ...movie };
          let nm = new NewMovie()

          this.movies.push( { ...nm, ...mv } );


          /*
            let movieTmdb = await this.tmdb.MovieDetailsTmdb$(movieFb.id).subscribe((data)=>{
              
              let m = new NewMovie();

              

              console.log("this.movies")
              console.log({ ...movie, ...m })
            });
          */
          

          
          
        })

        console.log("this.movies")
        console.log(this.movies[0])


      })

      /*
      this.tmdb.getMovieDetails$(this.movieId).subscribe( async (data:Movie) => {
  
        this.movie = { ...this.movie, ...data, };
  
      }).add( async()=> {
        
        let images = await this.tmdb.getImagesTmdb(this.movie.id);
        this.movie = { ...this.movie, ...images };
  
      });
      */
  
  
    }

    showAsSelection(event){
      console.log(event.target.value);

      this.authService.user.prefs.showMoviesAs = event.target.value.toLowerCase();
  
      this.us.setItem(this.authService.user)

    }


    







}
