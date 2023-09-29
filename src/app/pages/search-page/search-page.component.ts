// Angular
import { Component } from '@angular/core';

// rxjs
import { Observable, throwError, map } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';


// Services
import { MovieService } from "../../shared/services/movie.service";
import { SearchService } from "../../shared/services/search.service";

// Models
import { Movie } from "../../shared/models/movie.model";




@Component({
  selector: 'search-page-component',
  templateUrl: './search-page.component.html'
})
export class SearchPageComponent {
  title = 'search-page-component';

    movies:Movie[];
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
            this.movies = data.results
            this.pages = data.page

            this.movies.forEach(movie => {
              console.log(movie)
              let m = new Movie(movie);
              movie.base_url = "https://image.tmdb.org/t/p/";

            })
        });
    }


}
