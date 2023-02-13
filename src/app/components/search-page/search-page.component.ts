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

    constructor(public ss:SearchService, public ms:MovieService){
        console.log("SearchPageComponent();")


    }


    ngOnInit() {
        this.loadMovies();

        //console.log(this.movies)
    }

    // LOAD //
    loadMovies(){

        this.ss.results?.subscribe( data => {
            this.movies = data.results
            this.movies.forEach(movie => {
              movie.base_url = "https://image.tmdb.org/t/p/";
            })
        });
    }


}
