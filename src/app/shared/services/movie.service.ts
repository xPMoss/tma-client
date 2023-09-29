// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// rxjs
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { isObservable } from 'rxjs';
import { take } from 'rxjs/operators';

// firebase
import { AngularFireDatabase, AngularFireObject, AngularFireList } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';


// Models
import { Genre, Keyword, Movie } from "../models/movie.model";
import { List } from "../models/list.model";

import { movies as moviedb } from 'src/assets/db';
import { TmdbResult } from '../models/tmdb.model';
import { FirebaseMovie } from '../models/firebase.model';

import { TmdbService } from './tmdb.service';
import { AuthService } from './auth.service';



@Injectable({ providedIn: 'root' })
export class MovieService {

  page:string;

  // Firebase objects
  lists:AngularFireList<List>;
  movies:AngularFireList<Movie>;
  listsLoading:boolean = true;
  moviesLoading:boolean = true;

  $lists:Observable<any> = new Observable;

  //
  recommendedMovies:Movie[];
  similarMovies:Movie[];

  trendingMovies:Movie[] = [];
  topRatedMovies:Movie[] = [];
  popularMovies:Movie[] = [];

  trendingMoviesLoading:boolean = true;
  topRatedMoviesLoading:boolean = true;
  popularMoviesLoading:boolean = true;

  // a = all
  aLists: List[] = [];
  aMovies:Movie[] = [];

  // c = current
  cList: List;
  cLists: List[] = [];

  cMovie:Movie;
  cMovies:Movie[] = [];

  cTag:Keyword[];
  cKeyword:Keyword[];
  cGenre:Genre[];
  
  cTags:Keyword[];
  cKeywords:Keyword[];
  cGenres:Genre[];

  debug:boolean = false;

  user:any;

  timer = { 
    start:Date.now(),
    stop:null,
    time:null
  }

  constructor( 
    private authService:AuthService, 
    private db:AngularFireDatabase, 
    private tmdb:TmdbService, 
    private http:HttpClient, 
    public afAuth: AngularFireAuth 
    ) {
    console.log("MovieService()")

    // Load user from localStorage
    let user = JSON.parse(localStorage.getItem('user')!);
    this.user = user;

    // Resolve user
    let obj = new Promise<any>((resolve)=> {
      this.afAuth.authState.subscribe( (user) => { 
        resolve(user) 
        if(this.debug)console.log("resolve user"); // DEBUGGING

        this.user.uid = user.uid;
        this.user.email = user.email;
      });

    }).then( (user) => {
      preload();

    })
    

    // ----->>
    let movieList = moviedb;

    for (let i = 0; i < movieList.length; i++) {
      let m = movieList[i];

      //this.db.list('movies').remove(m.id.toString());
      //this.db.list('movies').update(m.id.toString(), m)
    }
    // <<-----

    let preload = () => {
      console.log("Preload")
      for (let i = 0; i < 20; i++) {
        let data = {

        }
        let movie = new Movie(data);
        this.popularMovies.push(movie)
        
      }

      for (let i = 0; i < 20; i++) {
        let data = {

        }
        let movie = new Movie(data);
        this.trendingMovies.push(movie)
        
      }

      for (let i = 0; i < 20; i++) {
        let data = {

        }
        let movie = new Movie(data);
        this.topRatedMovies.push(movie)
        
      }

     
    }

     // Timer
     this.timer.stop = Date.now();
     this.timer.time = (this.timer.stop-this.timer.start) / 1000;
     if(this.debug)console.log(this.timer) // DEBUGGING

  }


  async copyData(type:any, fromID:any, uid:string){

    // Fetch
    let items = await new Promise<any>((resolve)=> {
      try{
        this.db.list(type).valueChanges().subscribe( data => resolve(data) )
       } 
       catch(e){
        console.log(e)

       }
      
    })

    console.log(items)

    // Set
    for (const data of items) {
      this.db.list(type + "_" + uid).update(data.title.toString(), data);
    }
    

  }

  loadHomeMovies(){
    // Load popular movies
    this.loadMoviesTmdb("popular").then( async(data)=>{
      this.popularMovies = data;
      this.popularMoviesLoading = false;

      let time = 0;
      for (const iterator of data) {
        time += iterator.ticker.time;
      }

    })

    // Load trending movies
    this.loadMoviesTmdb("trending").then( async(data)=>{
      this.trendingMovies = data;
      this.trendingMoviesLoading = false;
    })

    // Load toprated movies
    this.loadMoviesTmdb("toprated").then( async(data)=>{
      this.topRatedMovies = data;
      this.topRatedMoviesLoading = false;
      
    })



  }

  async loadMoviesTmdb(type):Promise<Movie[]>{
    
    let page = 1
    let result:any;
    let movies:Movie[] = [];

    let loadmovies = async()=>{
      let _movies:Movie[];
      let movies:Movie[] = [];

      let rated:number = 0;

      if (type == "popular") {
        result = await this.tmdb.getPopularTmdb(page)
        
      }
      else if (type == "trending") {
        result = await this.tmdb.getTrendingMovies(page)
        
      }
      else if (type == "toprated") {
        result = await this.tmdb.getTopRatedTmdb(page)
        
      }
      else{
        result = null
      }

      _movies = result.results;

      
      for (const m of _movies) {
        // nm = new movie
        let nm = new Movie(m);
        
        // Check if is age appropriate
        let age:number;
        if (this.authService.user) {
          if(this.authService.user.settings){
            age = this.authService.user.settings.ageRating;
          }
          

        }

        let show:boolean;
        if (age) {
          show = await nm.checkRating(age)
        }

        if ( show ) {
          await nm.init();
          await nm.preload();
          movies.push(nm);
          rated++
        }
        
        if(this.debug)console.log("show: " + show + ", age: " + age) // DEBUGGING

        //console.log(type +" - "+ page + " " + _movies.length + "reated: " +rated)


      };

      return movies;

    };

    movies = await loadmovies();
    

    while ( movies.length < 20 && page < result.total_pages) {
      page++;

      let moreMovies = await loadmovies();
      for(let m of moreMovies){
        movies.push(m);
      }
      

    }
    
    if(this.debug) console.log("Found movies: " + movies.length) // DEBUGGING
    
    /*
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
    */


  
    
    
    return movies;


  }

  loadUserMovies(){


    // Load lists
    this.lists = this.db.list('lists_' + this.user.uid, ref => ref.orderByChild('title'));
    this.lists.valueChanges().subscribe( (ls) => {

      ls.forEach(async (l) => {
        l.movies = [];
        if (l.title == "Saved") {
          l.show = true;
          this.cLists.push(l)
        }
        this.aLists.push(l)
        
      })
      
      
    })

    // Load movies
    this.movies = this.db.list('movies_' + this.user.uid, ref => ref.orderByChild('title'));

    this.movies.valueChanges().subscribe( async (ms:Movie[]) => {
      // ms = movies
      // m = movie
      this.aMovies = []
      if(this.debug)console.log(ms.length) // DEBUGGING
      
      for (const m of ms) {
        // nm = new movie
        let nm = new Movie(m);
        this.aMovies.push(nm)
        
        // m = movie
        for(const l of this.aLists) {
          // l = list
          if (m.lists.includes(l.title)) {
            l.movies.push(nm)
          }   

        };

      };

      this.cMovies = this.aMovies;
      this.moviesLoading = false;

      // Load info
      for (const m of this.aMovies) {
        m.preload();

      };

      // Load images and misc
      for (const m of this.aMovies) {
        // nm = new movie
        // Check if is age appropriate
        let age:number;
        if (this.authService.user) {
          if(this.authService.user.settings){
            age = this.authService.user.settings.ageRating;
          }
          

        }

        let show:boolean;
        if (age) {
          show = await m.checkRating(age)
        }

        
        if ( show ) {
          m.init();

        }

        console.log("show: " + show + ", age: " + age)

        
      };

      //->
      /*
      for await (const m of ms) {
        // nm = new movie
        let nm = new Movie(m);
        let show = await nm.checkRating()
        
        if ( show ) {
          this.aMovies.push(nm)
          await nm.init();

          // m = movie
          for(const l of this.aLists) {
            // l = list
            if (m.lists.includes(l.title)) {
              l.movies.push(nm)
            }   

          };
          
        }

        
        

      };
      */
      //<-

      
     
      if(this.debug)console.log("<ALL LISTS>") // DEBUGGING
      if(this.debug)console.log(this.aLists) // DEBUGGING
      if(this.debug)console.log("<ALL MOVIES>") // DEBUGGING
      if(this.debug)console.log(this.aMovies) // DEBUGGING
      
    })

    return true;

  }

  loadMovies(){
    let obj = new Promise<any>((resolve)=> {
      this.db.list('movies_' + this.user.uid, ref => ref.orderByChild('title')).valueChanges().subscribe( 
        data => resolve(data) 
        )

    })

    console.log("obj")
    console.log(obj)

    return obj;

  }

  loadLists(){

    let obj = new Promise<any>((resolve)=> {
      this.db.list('lists_' + this.user.uid, ref => ref.orderByChild('title')).valueChanges().subscribe( 
        data => resolve(data) 
        )

    })

    console.log("obj")
    console.log(obj)

    return obj;

  }


  // CRUD
  
  MoviesFirebase$():Observable<any[]>{
    if(this.debug)console.log("//-----MoviesFirebase$()-----//") // DEBUGGING

    return this.db.list( 'movies_' + this.user.uid, ref => ref.orderByChild('title') ).valueChanges();

  }

  //**********************//
  //******** CRUD ********//
  //**********************//

  // GET/:name //
  findItemByName(name){
    console.log("name: " + name)
    
    //let data = this.db.list( 'projects', ref => ref.orderByChild('name').equalTo( name ) ).valueChanges();
 
    let obj = new Promise<any>((resolve)=> {
      this.db.list( 'movies_' + this.user.uid, ref => ref.orderByChild('name').equalTo( name ) ).valueChanges().subscribe( data => resolve(data) )
    })

    return obj;
  }

  // GET/:name //
  getItemById(id):AngularFireList<Movie>{
    //console.log("id: " + id)
    console.log(this.user)

    return this.db.list( 'movies_' + this.user.uid, ref => ref.orderByChild('id').equalTo( id ) );


  }

  // GET/:name //
  findItem(name){
    let obj = new Promise<any>((resolve)=> {
      this.db.list( 'movies_' + this.user.uid, ref => ref.orderByChild('name').equalTo( name ) ).valueChanges().subscribe( 
        data => resolve(data) 
        )

    })

    return obj;
  }

  /////////
  // PUT //
  async setItem(item:any) {
    console.log("setItem")
    console.log(item.id)
    console.log(item)

    let movie_user:any;
    movie_user = { id: item.id, saved:true };

    //movie_user = { id: item.id, seen: item.seen };

    if (item.seen==undefined) {
      
    }

    if (item.favorite==undefined) {
      item.favorite=false;
    }
    console.log(typeof item.vote);


    await this.db.list('movies_' + this.user.uid).update(item.id.toString(), item)
    
  }

  //////////
  // POST //
  async addItem(item){
    let status:number;
    let returnedItem = await this.findItem(item.id);

    console.log("returnedItem")
    console.log(returnedItem)

    if (returnedItem.length > 0) {
      console.log("FOUND ITEM!!!")
      status = 400;
    }
    else{
      console.log("ITEM NOT FOUND!!!")
      status = 200;
      this.db.list( 'movies_' + this.user.uid ).update(item.id, item)
      console.log("Item added")
    }

    return status
  }

  ////////////
  // DELETE //
  async deleteItem(item){
    this.db.list('movies_' + this.user.uid).remove(item.id.toString());


  }

}