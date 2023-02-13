// Angular
import { Injectable } from '@angular/core';

// rxjs
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

// firebase
import { AngularFireDatabase, AngularFireObject, AngularFireList } from '@angular/fire/compat/database';

// Models
import { Genre, Keyword, Movie } from "../models/movie.model";
import { List } from "../models/list.model";


// Tmdb
import { TmdbService } from "./tmdb.service";

import { movies as moviedb } from 'src/assets/db';


@Injectable({ providedIn: 'root' })
export class DiscoverService {

  lists:AngularFireList<List>;
  list:List;

  cList: List;
  cLists: List[] = [];

  movies:AngularFireList<Movie>;
  movie:Movie;

  recommendedMovies:Movie[];
  similarMovies:Movie[];

  cMovie: Movie;
  cMovies:Movie[] = [];

  //--
  cTag:Keyword;
  cKeyword:Keyword;
  cGenre:Genre;
  
  cTags:Keyword[];
  cKeywords:Keyword[];
  cGenres:Genre[];


  constructor( private db:AngularFireDatabase) {
    console.log("DiscoverService()")

  }
    
    




}