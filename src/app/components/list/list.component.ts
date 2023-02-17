// Angular
import { Component, OnInit, Input } from '@angular/core';
import {NgForm, FormGroup, FormControl, FormBuilder } from '@angular/forms';

// rxjs
import { Observable, throwError, map, Subscription, BehaviorSubject } from 'rxjs';
import { catchError, retry, switchMap  } from 'rxjs/operators';

// Services
import { TmdbService } from "../../shared/services/tmdb.service";
import { MovieService } from "../../shared/services/movie.service";
import { ListService } from "../../shared/services/list.service";

// Models
import { Movie } from "../../shared/models/movie.model";
import { List } from "../../shared/models/list.model";

@Component({
  selector: 'list-component',
  templateUrl: './list.component.html'
})
export class ListComponent {
  title = 'Lists';

  @Input() lists:List[];
  cLists:List[];
  cList:List;

  movies:Movie[];
  @Input() cMovies:Movie[];

  listForm:FormGroup;
 
 
  constructor(public tmdb:TmdbService, public ms:MovieService, public ls:MovieService, private fb:FormBuilder){
    
  }

  ngOnInit() {
    if (this.ms.cMovies.length < 1) {
      this.ms.loadUserMovies();
      
    }
    
    this.cLists = this.lists;

    this.listForm = this.fb.group({
      list: [null]
    });


    

    // If no cMovie
    if (!this.cLists) {
      console.log("No cLists!!!")

      let cMovie = localStorage.getItem('cLists');

    }
    else{
        localStorage.removeItem('cLists');
        //localStorage.setItem('cLists', this.ms.cMovie.id.toString());

      
    }


  }

  showMsg(value){
    console.log(value)
  }


  submit() {
    console.log("Form Submitted")
    console.log(this.listForm.value)
  }

  changeList(){
    //console.log(this.listForm.value.list)
    //console.log(this.lists)

    this.cLists = [];


    this.lists.forEach(element => {
      if ( this.listForm.value.list.includes(element.title) ) {
        //console.log(element.title)
        this.cLists.push(element);

      }
    });
    

  }






}
