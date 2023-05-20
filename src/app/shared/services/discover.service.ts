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
import { Result } from "../models/result.model";

import { genres as genresdb } from 'src/assets/db';

// Tmdb
import { TmdbService } from "./tmdb.service";
import { AuthService } from './auth.service';

import { movies as moviedb } from 'src/assets/db';


@Injectable({ providedIn: 'root' })
export class DiscoverService {
  
  lists:AngularFireList<List>;
  list:List;

  cList: List;
  cLists: List[] = [];

  result:Result = new Result();

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

  loadingMovies:boolean = false;
  sortBy:string = "popularity.desc";
  
  public tmdbGenres = genresdb;



  constructor( private db:AngularFireDatabase, public tmdb:TmdbService, private authService:AuthService,  ) {
    console.log("DiscoverService()")

  }


  async loadMovies(){
    console.log(this.constructor.name + ".setMovies()")

    
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

    this.loadingMovies = true;

    let params = {
      sort_by: this.sortBy,
      with_genres: []
    };

    for (const iterator of this.cGenres) {
      for (const g of this.tmdbGenres) {

       if (g.id == iterator.id) {
        g.active = true;
        params.with_genres.push(iterator.id)

       }
       
      }
      console.log("genre: " + iterator.name)
      
    }

    this.loadingMovies = true;

    // Preload movies
    if (this.result.moviesLoaded < 1) {
      this.result = await this.preSearch(params);
    }
    

    // Find movies
    let tries = 0;

    while(this.result.moviesLoaded < this.result.moviesToLoad && this.result.total_pages > this.result.page && tries < 10){
      tries++;

      await this.loadMoviesTmdb(params).then( async (data)=>{
        console.log(data)

        for (const d of data) {
          this.cMovies.push(d);
          this.result.moviesLoaded++;

        }

      })

      this.result.page++;
      
    }

    this.result.movies = this.cMovies.length;
    this.result.pages = Math.ceil(this.cMovies.length / 20);
    this.result.moviesToLoad = this.result.moviesLoaded + 20;
    this.loadingMovies = false;
    


  }

  async preSearch(params):Promise<Result>{
    
    params.page = this.result.page;

    let data:any;
    let result:Result = new Result();

    data = await this.tmdb.movieDiscoverTmdb(params);

    console.log("|||||DATA|||||")
    console.log(data)

    result.results = data.results;
    result.total_pages = data.total_pages;
    result.total_results = data.total_results;

    return result;


  }


  async loadMoviesTmdb(params):Promise<Movie[]>{
    
    params.page = this.result.page;

    let loadmovies = async()=>{
      let data:any;
      let movies:Movie[] = [];

      data = await this.tmdb.movieDiscoverTmdb(params);

      let _movies = data.results;

      this.result.total_pages = data.total_pages;
      this.result.total_results = data.total_results;

      for (const d of _movies) {
        let m = new Movie(d);

        // Check if is age appropriate
        let age:number = 16
        if (this.authService.user) {
          age = this.authService.user.settings.ageRating;
        }

        let show = await m.checkRating(age);
        if ( show ) {
          await m.init();
          await m.preload();
          movies.push(m);
          
        }
        
      }
     
      return movies;

    };

    
    let movies:Movie[] = await loadmovies();

    return movies;


  }

  reset(){
    console.log(this.constructor.name + ".reset()")

    this.result = new Result();

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