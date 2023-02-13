// Angular
import { Injectable } from '@angular/core';

// rxjs
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';


// Models
import { Movie } from "../models/movie.model";

// Tmdb
import { TmdbService } from "./tmdb.service";
import { TmdbResult } from "../models/tmdb.model";

@Injectable({ providedIn: 'root' })
export class HomeService {
  debug:boolean = true;

  constructor() {
    if(this.debug)console.log("HomeService()") // DEBUGGING



  }



}