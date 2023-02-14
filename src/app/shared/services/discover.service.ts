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

import { genres as genresdb } from 'src/assets/db';

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

  recommendedMovies:Movie[] = [];
  similarMovies:Movie[];

  cMovie: Movie;
  cMovies:Movie[] = [];

  //--
  cTag:Keyword;
  cKeyword:Keyword;
  cGenre:Genre;
  
  cTags:Keyword[] = [];
  cKeywords:Keyword[] = [];
  cGenres:Genre[] = [];

  loadMovies:boolean = false;
  sortBy:string = "popularity.desc";
  
  public tmdbGenres = genresdb;



  constructor( private db:AngularFireDatabase, public tmdb:TmdbService ) {
    console.log("DiscoverService()")

  }


  setMovies(){
    console.log(this.constructor.name + ".setMovies()")

    this.loadMovies = false;

    let params = {
      sort_by: this.sortBy,
      with_genres: []
    };
    /*
    popularity.asc, popularity.desc, release_date.asc, release_date.desc, revenue.asc, revenue.desc, primary_release_date.asc, primary_release_date.desc, original_title.asc, original_title.desc, vote_average.asc, vote_average.desc, vote_count.asc, vote_count.desc
    default: popularity.desc - optional
    this.cTag = undefined;
    this.cKeyword = undefined;
    this.cGenre = undefined;
    
    this.cTags = []
    this.cKeywords = []
    this.cGenres = []
    */

    for (const iterator of this.cGenres) {
      for (const g of this.tmdbGenres) {

       if (g.id == iterator.id) {
        g.active = true;
        params.with_genres.push(iterator.id)

       }
       
      }
      console.log("genre: " + iterator.name)
      

      if (!this.loadMovies) {
        this.loadMovies = true;
      }
      
    }

    if (this.loadMovies) {
      this.loadMoviesTmdb(params).then( async (data)=>{
        console.log(data)
        this.cMovies = data;
  
      })
    }
    


  }

  async loadMoviesTmdb(params):Promise<Movie[]>{
    
    let page = 1

    let loadmovies = async()=>{
      let data:Movie[];
      let movies:Movie[] = [];

      data = await this.tmdb.movieDiscoverTmdb(params);

      for await (const d of data) {
        let m = new Movie(d);
        let show = await m.checkRating()
  
        if ( show ) {
          await m.init();
          movies.push(m)
          
        }
  
      }

      return movies;

    };

    let movies:Movie[] = await loadmovies();

    while (movies.length < 20) {
      page++;
      let more:Movie[] = await loadmovies();
      for (const m of more) {
        movies.push(m)
        
      }

    }

    // If < 20 load more movies
    if (movies.length < 20) {
      page++;
      let more:Movie[] = await loadmovies();
      for (const m of more) {
        movies.push(m)
        
      }
    }

    return movies;


  }

  reset(){
    console.log(this.constructor.name + ".reset()")

    for (const iterator of this.tmdbGenres) {
      iterator.active = false;
    }

    this.sortBy = "popularity.desc";

    this.cList = undefined;
    this.cLists = []
    this.cMovie= undefined;
    this.cMovies = []

    //--
    this.cTag = undefined;
    this.cKeyword = undefined;
    this.cGenre = undefined;
    
    this.cTags = []
    this.cKeywords = []
    this.cGenres = []


  }
    
  // Sort
  sortArrayBy(array, field, reverse){

    array.sort( (a, b)=> {

      if (a[field] < b[field]){
        let val = -1;
        if(reverse){ 
          val = 1;
        };
        return val;
      }
        
      if (a[field] > b[field]){
        let val = 1;
        if(reverse){ 
          val = -1;
        };
        return val;
      }
        
      return 0;

    })

  }





}