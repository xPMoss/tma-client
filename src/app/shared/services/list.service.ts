// Angular
import { Injectable } from '@angular/core';

// rxjs
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

// firebase
import { AngularFireDatabase, AngularFireObject, AngularFireList } from '@angular/fire/compat/database';

// Models
import { Movie } from "../models/movie.model";
import { List } from "../models/list.model";



@Injectable({ providedIn: 'root' })
export class ListService {

  lists:AngularFireList<List>;
  list:List;

  cList: List;
  cMovies:AngularFireList<Movie>;

  movies: AngularFireList<Movie>;
  movie:Movie;

  cMovie: Movie;

  constructor( private db:AngularFireDatabase) {
    console.log("ListService()")



    
    
    this.lists = this.db.list('lists', ref => ref.orderByChild('title'));



  }





  // GET/:name //
  findItemByName(name){
    console.log("name: " + name)
    
    //let data = this.db.list( 'projects', ref => ref.orderByChild('name').equalTo( name ) ).valueChanges();
 
    let obj = new Promise<any>((resolve)=> {
      this.db.list( 'movies', ref => ref.orderByChild('name').equalTo( name ) ).valueChanges().subscribe( data => resolve(data) )
    })

    return obj;
  }

  // GET/:name //
  getItemById(id):AngularFireList<Movie>{
    console.log("od: " + id)

    return this.db.list( 'movies', ref => ref.orderByChild('id').equalTo( id ) );
  }

  // GET/:name //
  findItem(name){
    let obj = new Promise<any>((resolve)=> {
      this.db.list( 'movies', ref => ref.orderByChild('name').equalTo( name ) ).valueChanges().subscribe( data => resolve(data) )

    })

    return obj;
  }



  /////////
  // PUT //
  async setItem(item:any) {
    console.log("setItem")
    console.log(item.id)

    let movie_user:any;
    movie_user = { id: item.id, saved:true };

    //movie_user = { id: item.id, seen: item.seen };

    if (item.seen==undefined) {
      
    }

    await this.db.list('movies').update(item.id.toString(), item)
    
  }


  //////////
  // POST //
  async addItem(item){
    let status:number;
    let returnedItem = await this.findItem(item.id);

    console.log("returnedItem")
    console.log(returnedItem)

    if (returnedItem.length > 0) {
      console.log("FOUND ITEM!!!")
      status = 400;
    }
    else{
      console.log("ITEM NOT FOUND!!!")
      status = 200;
      this.db.list('movies').update(item.id, item)
      console.log("Item added")
    }

    return status
  }



  ////////////
  // DELETE //
  async deleteItem(item){
    this.db.list('movies').remove(item.id.toString());


  }





}