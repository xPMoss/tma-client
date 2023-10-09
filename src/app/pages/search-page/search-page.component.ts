// Angular
import { Component } from '@angular/core';

// rxjs
import { Observable, throwError, map } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';


// Services
import { MovieService } from "../../shared/services/movie.service";
import { SearchService } from "../../shared/services/search.service";

// Models
import { Movie, Result } from "../../shared/models/movie.model";
import { TmdbImages, TmdbMovie } from 'src/app/shared/models/tmdb.model';




@Component({
  selector: 'search-page-component',
  templateUrl: './search-page.component.html'
})
export class SearchPageComponent {
  title = 'search-page-component';

    result:Result;
    pages:number;
    cPage:Number;

    constructor(public ss:SearchService, public ms:MovieService){
        console.log("SearchPageComponent();")
        this.loadMovies();

    }


    ngOnInit() {
        this.loadMovies();

        //console.log(this.movies)
    }

    // LOAD //
    loadMovies(){

        this.ss.results?.subscribe( data => {
          console.log("loadMovies")
          
            this.result = { ...data, ...(new Result()) };
           
            this.result.results.forEach(movie => {
              console.log(movie)

              let m = new Movie();

            

            })
        });
    }


}
