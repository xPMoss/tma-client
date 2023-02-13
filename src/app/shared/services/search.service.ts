// Angular
import { Injectable } from '@angular/core';

// rxjs
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

// firebase
import { AngularFireDatabase, AngularFireObject, AngularFireList } from '@angular/fire/compat/database';

// Models
import { Movie } from "../models/movie.model";


// Tmdb
import { TmdbService } from "./tmdb.service";
import { TmdbResult } from "../models/tmdb.model";

@Injectable({ providedIn: 'root' })
export class SearchService {

  movies:Movie[];
  movie:Movie;

  results:Observable<TmdbResult> | undefined;

  movieResults:Movie[];
  

  trendingMovies: Observable<TmdbResult>


  constructor( private db:AngularFireDatabase, public tmdb:TmdbService ) {
    console.log("SearchService()")
    

  }

  SearchForMoviesTmdb(value){
    this.results = this.tmdb.searchMoviesTmdb(value, 1);

  }



}