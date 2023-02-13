// Angular
import { Component } from '@angular/core';
import { Router } from '@angular/router';

// rxjs
import { Observable } from 'rxjs';

import { MovieService } from "../../services/movie.service";
import { TmdbService } from "../../services/tmdb.service";
import { SearchService } from "../../services/search.service";
import { Movie } from "../../models/movie.model";


@Component({
  selector: 'search-field-component',
  templateUrl: './search-field.component.html'
})
export class SearchFieldComponent {
  title = 'search-field-component';

  value:string;
  movies:Movie[] | undefined;

  constructor(private router: Router, public ss:SearchService, public ms:MovieService, public tmdb:TmdbService){

  }

  ngOnInit() {

  }

    // LOAD //
    loadMovies(){

    this.ss.results?.subscribe( async (data) => {
      this.movies = data.results
      console.log(this.movies)


      this.movies.forEach(movie => {
        movie.base_url = "https://image.tmdb.org/t/p/";

      })

      this.ss.movies = this.movies;

    });


  }

  async search(){
    //console.log(this.value)
    this.movies = [];

    this.tmdb.searchMoviesTmdb(this.value, 1).subscribe( async (data) => {
        this.ss.movies = [];

      data.results.forEach(movie => {
        let m = new Movie(movie);
        movie.base_url = "https://image.tmdb.org/t/p/";
        this.ss.movies.push(movie);
        this.movies.push(m);

      })

      this.movies.forEach(movie => {
        movie.init()

      })

      
    });

    //this.loadMovies();

    //console.log("found movies")
    //console.log(this.movies)
  }

  fullSearch(){
    console.log("Fullsearch")
    console.log(this.value)

    this.ss.movieResults = this.movies;

    this.value = "";
    this.movies = [];
    this.ss.movies = undefined;
    
    this.router.navigate(['search'])

  }

  clear(){
    
    this.ss.movieResults = [];

    this.value = "";
    this.movies = [];
    this.ss.movies = undefined;


  }


  checkEvent(event: any){

    if (event.key=="Enter") {
      console.log("Pressed enter")
      
      this.router.navigate(['search'])

      this.value = "";
      this.movies = undefined;
      this.clear()

    }



  }


}
