// Angular
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { Router} from '@angular/router';

// rxjs
import { Observable, throwError, map } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';


// Services
import { MovieService } from "../../shared/services/movie.service";
import { TmdbService } from "../../shared/services/tmdb.service";
import { DiscoverService } from "../../shared/services/discover.service";

import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { MsgService } from "../../shared/services/msg.service";


// Models
import { Movie } from "../../shared/models/movie.model";
import { List } from "../../shared/models/list.model";

@Component({
  selector: 'movie-detail-component',
  templateUrl: './movie-detail.component.html',
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
export class MovieDetailComponent {
    title = 'movie-detail-component';

    // TEST
    @Output() newItemEvent = new EventEmitter<string>();
    addNewItem(value: string) {
        this.newItemEvent.emit(value);
    }
    // -END

    movies:Movie[];
    movie:Movie;

    lists:List[];

    alternativeMovies:Movie[];
    recommendedMovies:Movie[];
    similarMovies:Movie[];
    
    @Input() cMovie:Movie[];
    runtime:string;

    isLoggedIn:boolean = false;

    constructor(
        public ms:MovieService, 
        public location: Location, 
        public tmdb:TmdbService, 
        public ds:DiscoverService,
        public auth:AuthService,
        public router:Router,
        private msg:MsgService
        ){
       
    }
    
    ngOnInit(){
        console.log("MovieDetailComponent.ngOnInit()")

       

        if (this.ms.page) {
            localStorage.setItem('page', this.ms.page);
        }
        
        //const cat = localStorage.getItem('myCat');
        //localStorage.setItem('myCat', 'Tom');
        //localStorage.removeItem('myCat');
        //localStorage.clear();

        this.isLoggedIn = this.auth.isLoggedIn;

        let check = async ()=>{
            // If no cMovie
            if (!this.ms.cMovie) {
                console.log("No cMovie!!!")

                let cMovie = {
                    id:null
                }
                cMovie.id = localStorage.getItem('cMovie');
                console.log(cMovie)
                let movie = await new Movie(cMovie);
                await movie.preload();
                await movie.init();
                this.ms.cMovie = movie;
                
            }

            if(this.isLoggedIn){
                if (this.ms.cMovies.length < 1) {
                    this.ms.loadUserMovies();
                    
                }

                console.log("cMovie is present")

                await this.loadMovie(this.ms.cMovie.id);
                await this.loadLists();
                
                localStorage.setItem('cMovie', this.ms.cMovie.id.toString());

            }

            await this.getSimilarMovies(this.ms.cMovie.id);

            window.scroll({ 
                top: 0, 
                left: 0, 
                behavior: 'auto'
            });
        }

        check();

        

        
        

        
        
    }

    reload(){
        this.ngOnInit();
    }
    
    async getSimilarMovies(id){

        let similar = await this.tmdb.getSimilarMoviesTmdb(id);
        console.log(similar)


        if (similar) {
            this.similarMovies = [];

            similar.forEach( sm => {
                this.similarMovies.push( new Movie(sm) );
                

            });

            for (const movie of this.similarMovies) {
                movie.preload();
            }

            for (let i = 0; i < this.similarMovies.length; i++) {
                let sm = this.similarMovies[i]
                sm.init();
                
            }
        }

    }

    // LOAD //
    async loadMovie(id:number){
        this.ms.getItemById(id).valueChanges().subscribe( async (data)=>{

            console.log(data)

            if (data.length > 0) {
                this.ms.cMovie.setData(data[0])

            }
            else{
                this.ms.cMovie.saved = false;
                this.ms.cMovie.lists = [];
            }

        })


    }

    loadLists(){
      
        this.ms.lists.valueChanges().subscribe( async (data) => {
          this.lists = data;
            
          //console.log(this.lists)
          
        })
    
    }




    // SET //
    setItem(movie){
        this.ms.setItem(movie);

    }

    // SET:functions //
    rateMovie(movie, rating){
      
        movie.vote = rating.nextRate;
  
  
        console.log(movie.vote)
        console.log(rating.nextRate)
  
        let obj = {
          id:movie.id,
          vote:movie.vote,
          
          
        }
  
        this.setItem(obj)
  
    }

    saveMovie(movie){
        let obj = {
            id:movie.id,
            saved:true,
            title:movie.title,
            favorite:false,
            seen:false,
            vote:0,
            lists:["Saved"],
        }

        this.ms.setItem(obj);
    }

    saveSeen(movie){
        let obj = {
            id:movie.id,
            seen:movie.seen,
           
        }

        this.ms.setItem(obj);
    }

    addTag(tag){
        console.log("Not in list");
        this.ms.cMovie.tags.push(tag)

        let obj = {
            id:this.ms.cMovie.id,
            saved:this.ms.cMovie.saved,
            title:this.ms.cMovie.title,
            favorite:this.ms.cMovie.favorite,
            seen:this.ms.cMovie.seen,
            vote:this.ms.cMovie.vote,
            lists:this.ms.cMovie.lists,
            tags:this.ms.cMovie,
        }
        console.log(obj);
        this.ms.setItem(obj);


    }

    // REMOVE //
    removeMovie(movie){
        let obj = {
            id:movie.id,
            saved:false,
            title:movie.title,
            favorite:false,
            seen:false,
            vote:null,
            lists:null,
        }
        const item = { ...this.ms.cMovie, ...obj };
        this.ms.cMovie = item;

        this.ms.deleteItem(movie);
    }


    // HELPERS //
    checkIfInList(list){
        //console.log(this.ms.cMovie)
        let lists:string[] = this.ms.cMovie.lists;

        if ( !lists.includes(list.title) ) {
            //console.log(movie.lists)
            
            return false;

        }
        else{
            return true;

        }


    }

    checkIfSaved(){
        let movie = this.ms.movies.valueChanges().subscribe( (data) => {
            let found = false;

            data.forEach((m)=>{

                // If in db, combine objects
                if (m.id == this.ms.cMovie.id) {
                    const obj = { ...this.ms.cMovie, ...m };
                    this.ms.cMovie = obj;
                    found = true;

                    //console.log("isSaved: " + this.isSaved(this.ms.cMovie));
                }
                
            })

            if (!found) {
                //console.log("isSaved: " + this.isSaved(this.ms.cMovie));
                let saved_param = {saved:false}

                const obj = { ...this.ms.cMovie, ...saved_param };
                this.ms.cMovie = obj;
              
            }

        })


        
        
        


    }

    isSaved(obj: any): obj is { saved } {
        return 'saved' in obj;
    }

    



    // LISTS
    addToMovieToList(movie, list){

        if ( !movie.lists.includes(list) ) {
            console.log("Not in list");
            movie.lists.push(list)

            let obj = {
                id:movie.id,
                saved:movie.saved,
                title:movie.title,
                favorite:movie.favorite,
                seen:movie.seen,
                vote:movie.vote,
                lists:movie.lists,
            }
            

            console.log(obj);
            this.ms.setItem(obj);

        }
        else{
            console.log("In list!");

        }

        
        
    
    }

    close(){

        if (!this.ms.page) {
            let page = localStorage.getItem("page");
            this.ms.page = page.toLocaleLowerCase();
            
        }
        
        this.router.navigate([this.ms.page.toLocaleLowerCase()])
        

    }

    similar(movie){
        this.ms.cMovie = movie;
        this.router.navigate(['movie/' + movie.id])
       
        this.ngOnInit();


    }


    /*
    timeConvert(n) {
        var num = n;
        var hours = (num / 60);
        var rhours = Math.floor(hours);
        var minutes = (hours - rhours) * 60;
        var rminutes = Math.round(minutes);
        return rhours + "h " + rminutes + "min";
    }
    */

}
