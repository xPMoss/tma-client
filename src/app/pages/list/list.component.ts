// Angular
import { Component, OnInit, Input } from '@angular/core';
import {NgForm, FormGroup, FormControl, FormBuilder } from '@angular/forms';

// ng Bootstrap
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  templateUrl: './list.component.html',

})
export class ListComponent {
  title = 'Lists';

	closeResult = '';

  @Input() lists:List[];
  aLists:List[];
  cLists:List[];
  cList:List;

  movies:Movie[];
  aMovies:Movie[];
  @Input() cMovies:Movie[];

  listForm:FormGroup;
 
  content:boolean = false;
 
  constructor(
    public tmdb:TmdbService, 
    public ms:MovieService, 
    public ls:ListService, 
    private fb:FormBuilder, 
    private msg:MsgService,
    private modalService: NgbModal
    )
  {
    
  }



  open(content) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-new-list' }).result.then(
			(result) => {
				
			},
			(reason) => {
				
			},
		);
	}


  openDeleteListModal(content, list) {

    this.cList = list;

		this.modalService.open(content, { ariaLabelledBy: 'modal-delete-list' }).result.then(
			(result) => {
				
			},
			(reason) => {
				
			},
		);
	}

  ngOnInit() {
    
    this.init();
    
    this.cLists = this.lists;

    this.listForm = this.fb.group({
      list: [null]

    });

    // Load from localstorage <- NOT WORKING!
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

    // Load all movies <- (MovieService) <- [db]
    await this.ms.loadMovies().then( async (data)=>{
      this.aMovies = [];

      // Create movies
      for (const m of data) {
        let nm = new Movie(m);
        this.aMovies.push(nm)

      };

      // Load info
      for (const m of this.aMovies) {
        m.preload();

      };

      // Load images and misc <- (MovieClass) <- (TmdbService) <- [Tmdb]
      for (const m of this.aMovies) {
        m.init();
        
      };

    });

    // Load all lists <- (MovieService) <- [db]
    await this.ms.loadLists().then( (data)=>{
      this.aLists = [];

      for (const list of data) {
        if (list.title != "Saved") {
          this.aLists.push(list);
  
        }
      }
      
      // Reset lists
      for(const l of this.aLists) {
        l.movies = [];
      
      };

      // Add movies to lists
      for (const m of this.aMovies) {
        for(const l of this.aLists) {
          if (m.lists.includes(l.title)) {
            l.movies.push(m)

          }   

        }
      }

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

    // Reset current lists
    this.cLists = [];

    this.lists.forEach(element => {
      if ( this.listForm.value.list.includes(element.title) ) {
        this.cLists.push(element);

      }
    })
    
  }

  addList(data){

    // Create list item
    let item = {
      info:data.info,
      title:data.title,

    }

    if (data.title) {
      this.ls.addItem(item);

    }

    this.content = false;


    // Reload movies and lists
    this.init();

  }

  updateList(data){

    // Create list item
    let item = {
      info:data.info,
      title:data.title,

    }

    if (data.title) {
      this.ls.setItem(item);

    }

    // Reload movies and lists
    this.init();

  }

  async deleteList(list){

    await this.ls.deleteItem(list);
    this.cList = null;

    // Reload movies and lists
    this.init();

  }


}
