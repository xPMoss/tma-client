// Angular
import { Component } from '@angular/core';

// rxjs
import { Observable, map } from 'rxjs';


// Services
import { HomeService } from "../../shared/services/home.service";
import { MovieService } from "../../shared/services/movie.service";
import { TmdbService } from "../../shared/services/tmdb.service";

// Models
import { Movie } from "../../shared/models/movie.model";
import { List } from "../../shared/models/list.model";


@Component({
  selector: 'home-component',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  title = 'Home';
  debug:boolean = true;

  constructor(public hs:HomeService, public ms:MovieService, public tmdb:TmdbService){

  }

  ngOnInit() {

  }




}
