// Angular
import { Component } from '@angular/core';

// rxjs
import { Observable, map } from 'rxjs';


// Services
import { HomeService } from "../../shared/services/home.service";
import { MovieService } from "../../shared/services/movie.service";
import { TmdbService } from "../../shared/services/tmdb.service";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../../shared/services/auth.service';


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

  constructor(
    public hs:HomeService, 
    public ms:MovieService, 
    public tmdb:TmdbService,
    public afAuth: AngularFireAuth,
    private authService:AuthService, 

    )
  {

  }

  ngOnInit() {
    console.log( this.authService.userLoaded )

    this.ms.loadHomeMovies();

    

    
  }




}
