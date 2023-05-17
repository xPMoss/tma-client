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
import { MsgService } from "../../shared/services/msg.service";

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
  aLists:List[];
  cLists:List[];
  cList:List;

  movies:Movie[];
  aMovies:Movie[];
  @Input() cMovies:Movie[];

  listForm:FormGroup;
 
  newList:boolean = false;
 
  constructor(public tmdb:TmdbService, public ms:MovieService, public ls:ListService, private fb:FormBuilder, private msg:MsgService){
    
  }

  ngOnInit() {
    
    
    

    this.init();
    
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

  async init(){

    await this.ms.loadMovies().then( async (data)=>{
      this.aMovies = [];

      for (const m of data) {
        // nm = new movie
        let nm = new Movie(m);
        this.aMovies.push(nm)
        

      };

      // Load info
      for (const m of this.aMovies) {
        m.preload();

      };

      // Load images and misc
      for (const m of this.aMovies) {
        // nm = new movie
        let show = m.checkRating()
        
        if ( show ) {
          m.init();

        }
        
      };

    });

    this.aLists = [];

    await this.ms.loadLists().then( (data)=>{
      

      for (const list of data) {
        console.log(list);
        if (list.title != "Saved") {
          this.aLists.push(list);
  
        }
      }

      
      for(const l of this.aLists) {
        l.movies = [];
      
      };

      // Add all movies
      for (const m of this.aMovies) {
        // m = movie
        

        for(const l of this.aLists) {
          // l = list
          if (m.lists.includes(l.title)) {
            l.movies.push(m)

          }   

        };

      };

    });

    console.log(this.aLists);



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

  addList(data){
    console.log(data)
    let item = {
      info:data.info,
      title:data.title,
    }

    console.log(item)

    if (data.title) {
      console.log("not empty")
      this.ls.addItem(item);
    }

    this.newList=false;

    this.init();

  }

  deleteList(list){
    this.ls.deleteItem(list);
    
    this.init();


  }


}
