// Angular
import { Component, OnInit, Input } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

// ng Bootstrap
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

// rxjs
import { Observable, throwError, map, Subscription, BehaviorSubject } from 'rxjs';
import { catchError, retry, switchMap  } from 'rxjs/operators';

// Services
import { MovieService } from "../../shared/services/movie.service";
import { TmdbService } from "../../shared/services/tmdb.service";

// Models
import { Movie, Country, ReleaseDate, Certification, Genre, Keyword } from "../../shared/models/movie.model";
import { List } from "../../shared/models/list.model";
import { Filter, FilterLists } from "../../shared/models/filter.model";


@Component({
  selector: 'filter-component',
  templateUrl: './filter.component.html',
  styles: [`
    #filter {
        cursor:pointer;
        user-select: none;
        position:fixed;
        top:2rem;
        right:0rem;

        
        opacity:0.9;

    }
    .z-100{
      z-index:100;
    }
    
  `]
})

export class FilterComponent {
  title = 'Filter';
  debug:boolean = false;

  //--
  tags:Keyword[];
  keywords:Keyword[];
  genres:Genre[];

  //--
  filters:Filter[] = [];
  filter:Filter;
  cFiltersList:FilterLists[] = [];
  cFilters:Filter[] = [];
  cFilter:Filter;

  //--
  sortBy:string = "title";
  sortReverse:boolean = false;

  //--
  isCollapsed = true;
  show = true;
  showGenreFilter = false;

  filterIsAdd:boolean = true;

  modal:boolean = false;

  constructor(public tmdb:TmdbService, public ms:MovieService, private modalService: NgbModal){
    if(this.debug)console.log("FilterComponent()") // DEBUGGING
    
    
    // Create filter
    this.filters = this.createBaseFilters();

  }

  open(modal) {
		this.modalService.open(modal, { ariaLabelledBy: 'modal-new-list' }).result.then(
			(result) => {
				
			},
			(reason) => {
				
			},
		);
	}

  /********************/
  ngOnInit() {

    // If no cLists
    if (!this.ms.cLists) {
      //console.log("No cLists!!!")

      //let cLists = localStorage.getItem('cLists');

    }
    else{
        //localStorage.removeItem('cLists');
        //localStorage.setItem('cLists', this.ms.cMovie.id.toString());

    }

     // If no cMovie
    if (!this.ms.cMovies) {
      //console.log("No cMovies!!!")
      
      let cMovies = localStorage.getItem('cMovies');

      if (cMovies != null) {
        //let cMoviesArray = cMovies.split(",");

        //console.log("cMoviesArray");
        //console.log(cMoviesArray);

        //this.ms.cLists = [];
        //this.ms.cMovies = [];

      }

    }
    else{
        this.setLocalStorage();

    }

    //
    //console.log(this.ms.cMovies)
    //console.log(this.ms.cLists)

  }
  
  /********************/
  // LOCALSTORAGE / COOKIES
  setLocalStorage(){

    // Empty localstorage / cookies
    localStorage.removeItem('cMovies');
    localStorage.removeItem('cLists');
    localStorage.removeItem('cFilters');


    let cMoviesStr = "";
    //console.log(this.ms.cMovies);

    for (let i = 0; i < this.ms.cMovies.length; i++) {
      let m = this.ms.cMovies[i];

        //console.log(m.id);

      cMoviesStr += m.id;

      if (i < this.ms.cMovies.length-1) {
        cMoviesStr += ",";
      }

          
    }

    localStorage.setItem('cMovies', cMoviesStr);

    //console.log("cMoviesStr");
    //console.log(cMoviesStr);

  }

  /********************/
  // FILTERS
  createBaseFilters(){

    let rFilters:Filter[] = [];

    let filterTypes = ["genre", "keyword", "provider", "runtime","vote",]
    
    // LOOP
    for (const type of filterTypes) {
      let data = {
        id:"",
        type:type,
        options:[],
        show:true,
        active:false,
        filterIsAdd:true,
        genres:[],
        keywords:[],
        votes:[],
        runtimes:[],
        providers:[],
        favorite: false,
        watch:false,
        min:0,
        max:20,
        ms:this.ms,
  
      }
      
      data.id = this.createUniqeId(this.filters);

      let nFilter = new Filter(data);
      rFilters.push( nFilter )

      

      
      //this.filters.push( new Filter(data) );

    }

    let nFilterLists = {
      id:"",
      filters:rFilters,
      show:true,
      active:false,

    }
    // <--

    // New filterlist
    nFilterLists.id = this.createUniqeId(this.cFiltersList);
    this.cFiltersList.push(nFilterLists)

    return rFilters;

  }
  
  removeFilter(cfl){
    if(this.debug)console.log("removeFilter") // DEBUGGING
    

    this.clearFilter(cfl);

    let index = this.findIndex(this.cFiltersList, cfl)
    this.cFiltersList.splice(index, 1)

  }

  addFilter(){
    let tFilters = this.createBaseFilters();

    for (const f of tFilters) {
    }
    

  }

  chooseFilter(list, filter){
    console.log("chooseFilter")

    let listIndex = this.findIndex(this.cFiltersList, list)
    if (listIndex == -1) {
      
    }
    else{
      if(this.debug)console.log(listIndex) // DEBUGGING
      
      let cfl = this.cFiltersList[listIndex];

      cfl.active = true;
      cfl.activeFilter = filter;

      for (const f of cfl.filters) {
        f.active = false;
        
      }
  
      filter.active = !filter.active;
      filter.update();
      this.cFilter = filter;
    }



    let index = this.findIndex(this.cFilters, filter)
    if (index == -1) {
      this.cFilters.push(filter)
    }


    if(this.debug)console.log(this.cFilter) // DEBUGGING
   

  }


  // OPTIONS
  addFilterOption(filter, option){
    if(this.debug)console.log("add option") // DEBUGGING
    

    option.active = !option.active;

    console.log(filter)
    console.log(option)
    
    
    this.correctFilters()
    this.correctMovies();

  }

  navOptions(cfl, direction){
    if(this.debug)console.log(direction) // DEBUGGING
    

    let step = 10;

    if (direction == "+" && cfl.activeFilter.max <= cfl.activeFilter.options.length) {
      cfl.activeFilter.min += step;
      cfl.activeFilter.max += step;
    }

    if (direction == "-" && cfl.activeFilter.min >= 0) {
      cfl.activeFilter.min -= step;
      cfl.activeFilter.max += step;

    }
    

    if (cfl.activeFilter.min < 0 ) {
      cfl.activeFilter.min = 0;
      cfl.activeFilter.max = step;

    }

    if (cfl.activeFilter.max > cfl.activeFilter.options.length) {
      cfl.activeFilter.max = cfl.activeFilter.options.length;
      cfl.activeFilter.min = cfl.activeFilter.options.length - step;
    }

  }

  /********************/
  // LISTS
  addList(list){
    
    list.show = !list.show

    if (list.show && list.title == "Saved") {
      for (const al of this.ms.aLists) {
        al.show = false;
      }

      list.show = true;

    }

    if (list.show && list.title != "Saved") {
     for (const l of this.ms.aLists) {
        if (l.title == "Saved") {
      
          l.show = false;
        }
     }

    }

    if(this.debug)console.log(list) // DEBUGGING
    if(this.debug)console.log(this.ms.cLists) // DEBUGGING


    this.correctLists();
    this.correctMovies();
    this.correctFilters();
    
    

  }

  /********************/
  // CORRECT
  correctFilters(){
    for (const fl of this.cFiltersList) {
      for (const f of fl.filters) {
        f.update();
      }
      
    }


  }

  updateFilters(){
    for (const fl of this.cFiltersList) {
      for (const f of fl.filters) {
        f.update();
      }
      
    }

  }

  correctLists(){
    this.ms.cLists = [];

    for (const l of this.ms.aLists) {
      if (l.show) {
        this.ms.cLists.push(l)

      }

    }

    
    if (this.ms.cLists.length < 1) {
      this.clearLists();
    }

    // Remove duplicates
    let uniqueLists = [...new Set(this.ms.cLists)];
    this.ms.cLists = uniqueLists;
    
    this.sortArrayBy(this.ms.cLists, this.sortBy, this.sortReverse)
    this.setLocalStorage();

    // DEBUG
    if(this.debug)console.log("cLists") // DEBUGGING
    if(this.debug)console.log(this.ms.cLists) // DEBUGGING


  }

  correctMovies(){
    this.ms.cMovies = [];

    for (const movie of this.ms.aMovies) {
      
    }

    // Set movies based on lists
    for (const l of this.ms.cLists) {
      if (l.show) {
        for (const movie of l.movies) {
          this.ms.cMovies.push(movie)

        }

      }

    }

    if(this.debug)console.log("cMovies BEFORE FILTERS") // DEBUGGING
    if(this.debug)console.log(this.ms.cMovies) // DEBUGGING


    // Set movies based on filters
    let cGenres:any[] = []
    let cKeywords:any[] = [];
    let cVotes:any[] = [];
    let cRuntimes:any[] = [];
    let cProviders:any[] = []

    this.cFilters = [];

    for (const cfl of this.cFiltersList) {
     
      let populateCurrent = (data)=>{
        for (const opt of data.activeFilter.options) {
          if (opt.active) {
  
            if(cfl.activeFilter.type == "genre"){
              cGenres.push(opt)
            }
  
            if (cfl.activeFilter.type == "keyword") {
              cKeywords.push(opt)
            }
  
            if (cfl.activeFilter.type == "vote") {
              cVotes.push(opt)
            }
  
            if (cfl.activeFilter.type == "runtime") {
              cRuntimes.push(opt)
            }
  
            if (cfl.activeFilter.type == "provider") {
              cProviders.push(opt)
            }
            
          }
        }


      }


      // Populate content
      if (cfl.activeFilter) {
        this.cFilters.push(cfl.activeFilter)

        populateCurrent(cfl);

      }
      

  
    }

    if(this.debug)console.log("ACTIVE FILTERS") // DEBUGGING
    if(this.debug)console.log(cGenres) // DEBUGGING
    if(this.debug)console.log(cKeywords) // DEBUGGING
    if(this.debug)console.log(cVotes) // DEBUGGING
    if(this.debug)console.log(cRuntimes) // DEBUGGING
    if(this.debug)console.log(cProviders) // DEBUGGING


    let tMovies:Movie[] = [];

    // Set filtermovies
    for (const m of this.ms.cMovies) {
      // Every filter
      for (const f of this.cFilters) {
        let compareA:any[] = [];
        let compareB:any[] = [];
        let key:string = "";

        if (f.type == "genre") {
          compareA = cGenres;
          compareB = m.genres;
          key = "id";
        }

        if (f.type == "keyword") {
          compareA = cKeywords;
          compareB = m.keywords;
          key = "id";
        }

        if (f.type == "vote") {

        }

        if (f.type == "runtime") {

        }

        if (f.type == "provider") {
          compareA = cProviders;
          compareB = m.flatrate;
          key = "provider_id";
        }

        if(!this.isIterable(compareB)){
          compareB = []
        }

        // COMPARE
        for (let b of compareB) {
          for (let a of compareA) {

            if (a[key] == b[key]) {
              tMovies.push(m);
            }
            
            
          }

        }



      }

    }

    if(this.debug)console.log("tMovies") // DEBUGGING
    if(this.debug)console.log(tMovies) // DEBUGGING


    // IF SOME FILTER ACTIVE
    if (cGenres.length > 0 || cKeywords.length > 0 || cVotes.length > 0 || cRuntimes.length > 0 || cProviders.length > 0) {
      // IF FOUND MOVIES
      if (tMovies.length > 0) {
        this.ms.cMovies = tMovies;
      }
    }
    
    


    // Remove duplicates
    let uniqueMovies = [...new Set(this.ms.cMovies)];
    this.ms.cMovies = uniqueMovies;
    
    this.sortArrayBy(this.ms.cMovies, this.sortBy, this.sortReverse)
    this.setLocalStorage();

    // DEBUG
    if(this.debug)console.log("cLists") // DEBUGGING
    if(this.debug)console.log(this.ms.cLists) // DEBUGGING
    if(this.debug)console.log("cMovies") // DEBUGGING
    if(this.debug)console.log(this.ms.cMovies) // DEBUGGING
    
    
    
    

  }

  /********************/
  // CLEAR LiSTS //
  clearLists(){

    // Empty localstorage / cookies
    localStorage.removeItem('cMovies');
    localStorage.removeItem('cLists');

    this.ms.aLists.forEach(list => {
      list.show = false;

    });

    this.ms.aMovies.forEach(movie => {
      movie.show = false;

    });

    this.ms.cMovies = [];
    this.ms.cLists = [];

     // Set all movies
    for (const l of this.ms.aLists) {
      if (l.title == "Saved") {
        l.show = true;
        this.ms.cLists.push(l)
      }
    }

    this.correctLists();
    this.correctMovies();
    this.updateFilters();

  }

  // CLEAR FILTERS //
  clearFilters(){

    // Set all filters !active and !show
    for (const l of this.cFiltersList) {
      l.active = false;
      l.show = false;

      for (const f of l.filters) {
        f.active = false;
        f.show = false;

        for (const o of f.options) {
          o.active = false;
          o.show = false;
          
        }
      }
    }

    for (const f of this.cFilters) {
      f.active = false;
      f.show = false;

      for (const o of f.options) {
        o.active = false;
          o.show = false;
      }
    }

    for (const f of this.filters) {
      f.active = false;
      f.show = false;

      for (const o of f.options) {
        o.active = false;
          o.show = false;
      }
    }


    // Clear arrays
    this.ms.cMovies = [];
    this.cFiltersList = [];
    this.cFilters = [];
    this.cFilter = undefined;

    this.createBaseFilters()


    this.correctLists();
    this.correctMovies();
    this.updateFilters();

  }

  // CLEAR FILTERS //
  clearFilter(cfl){

    cfl.active = false;
    cfl.activeFilter = undefined;

    for (const f of cfl.filters) {
      f.active = false;
      for (const opt of f.options) {
        opt.active = false;
      }


    }

    this.ms.cMovies = [];
    //this.cFilters = [];
    this.cFilter = undefined;

    this.correctLists();
    this.correctMovies();
    this.updateFilters();



  }
  
  clearOptions(cfl){

    // Empty localstorage / cookies
    localStorage.removeItem('cMovies');
    localStorage.removeItem('cFilters');
    localStorage.removeItem('cOptions');

    for (const opt of cfl.activeFilter.options) {
      opt.active = false;


    }

    this.correctLists();
    this.correctMovies();
    this.updateFilters();

  }

  // CLEAR ALL //
  clearAll(){

    this.clearFilters();
    this.clearLists();

    // Empty localstorage / cookies
    localStorage.removeItem('cMovies');
    localStorage.removeItem('cLists');
    localStorage.removeItem('cFilters');

    this.ms.aLists.forEach(list => {
      list.show = false;

    });

    this.ms.aMovies.forEach(movie => {
      movie.show = false;

    });

    this.ms.cMovies = [];
    this.ms.cLists = [];

     // Set all movies
    for (const l of this.ms.aLists) {
        if (l.title == "Saved") {
          l.show = true;
          this.ms.cLists.push(l)
        }
    }

    this.correctLists();
    this.correctMovies();
    this.updateFilters();

    

  }



  // Sort
  sortArrayBy(array, field, reverse){

    array.sort( (a, b)=> {

      if (a[field] < b[field]){
        let val = -1;
        if(reverse){ 
          val = 1;
        };
        return val;
      }
        
      if (a[field] > b[field]){
        let val = 1;
        if(reverse){ 
          val = -1;
        };
        return val;
      }
        
      return 0;

    })

  }


  // Helpers
  isIterable(input) {  
    if (input === null || input === undefined) {
      return false
    }
  
    return typeof input[Symbol.iterator] === 'function'
  }


  createUniqeId(array){
    let filterIds = [];

    for (const a of array) {
      filterIds.push(a.id)

    }

    let makeId = (length)=> {
      let result = '';
      let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }
    
    let rndId = makeId(10);
    if(this.debug)console.log(rndId) // DEBUGGING


    while(filterIds.includes(rndId)){
      rndId = makeId(10);
      console.log(rndId);

    }

    return rndId;



  }


  findIndex(arr, obj){
    let index = arr.map(object => object).indexOf(obj);

    console.log("index: " + index)

    return index
  }

  msg(data){
    if(this.debug)console.log(data) // DEBUGGING
    
  }

}
