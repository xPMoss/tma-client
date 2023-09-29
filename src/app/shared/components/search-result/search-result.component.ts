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
  selector: 'search-result-component',
  templateUrl: './search-result.component.html'
})
export class SearchResultComponent {
  title = 'search-result-component';

  value:string;
  movies:Movie[] | undefined;

  visible:boolean = false;

  constructor(private router: Router, public ss:SearchService, public ms:MovieService, public tmdb:TmdbService){
    
    router.events.subscribe((val) => {
      this.clear()
    });

  }

  ngOnInit() {
    //this.loadMovies()

  }




  clear(){
    this.ss.movieResults = [];

    this.value = "";
    this.movies = [];
    this.ss.movies = undefined;

    this.visible = false;


  }






}
