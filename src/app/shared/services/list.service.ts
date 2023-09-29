// Angular
import { Injectable } from '@angular/core';

// rxjs
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

// firebase
import { AngularFireDatabase, AngularFireObject, AngularFireList } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { AuthService } from './auth.service';

// Models
import { Movie } from "../models/movie.model";
import { List } from "../models/list.model";



@Injectable({ providedIn: 'root' })
export class ListService {
  user:any;

  lists:AngularFireList<List>;
  list:List;

  cList: List;
  cMovies:AngularFireList<Movie>;

  movies: AngularFireList<Movie>;
  movie:Movie;

  cMovie: Movie;

  constructor( 
    private db:AngularFireDatabase,
    private authService:AuthService, 
    public afAuth: AngularFireAuth 
    ) {
    console.log("ListService()")
    
    let user = JSON.parse(localStorage.getItem('user')!);
    this.user = user;
    
    this.afAuth.authState.subscribe( (user) => {
      this.user = user;

    });



  }





  // GET/:name //
  findItemByName(name){
    console.log("name: " + name)
    
    //let data = this.db.list( 'projects', ref => ref.orderByChild('name').equalTo( name ) ).valueChanges();
 
    let obj = new Promise<any>((resolve)=> {
      this.db.list( 'lists_' + this.user.uid, ref => ref.orderByChild('title').equalTo( name ) ).valueChanges().subscribe( data => resolve(data) )
    })

    return obj;
  }


  // GET/:name //
  findItem(name){
    let obj = new Promise<any>((resolve)=> {
      this.db.list( 'lists_' + this.user.uid, ref => ref.orderByChild('title').equalTo( name ) ).valueChanges().subscribe( 
        data => resolve(data) 
        )

    })

    return obj;
  }



  /////////
  // PUT //
  async setItem(item:any) {
    let status:number;
    let returnedItem = await this.findItem(item.title);

    //await this.db.list( 'lists_' + this.user.uid ).update(item.title.toString(), item)
    
    console.log("returnedItem")
    console.log(returnedItem)

    if (returnedItem.length > 0) {
      status = 200;
      this.db.list( 'lists_' + this.user.uid ).update(item.title.toString(), item)
    }
    else{
      console.log("ITEM NOT FOUND!!!")
      status = 400;
     
    }

    return status

  }


  //////////
  // POST //
  async addItem(item){
    let status:number;
    let returnedItem = await this.findItem(item.title);

    console.log("returnedItem")
    console.log(returnedItem)

    if (returnedItem.length > 0) {
      console.log("FOUND ITEM!!!")
      status = 400;
    }
    else{
      console.log("ITEM NOT FOUND!!!")
      status = 200;
      this.db.list( 'lists_' + this.user.uid ).update(item.title.toString(), item)
      //this.db.list('movies').update(item.id, item)
      console.log("Item added")
    }

    return status
  }



  ////////////
  // DELETE //
  async deleteItem(item){
    this.db.list( 'lists_' + this.user.uid ).remove(item.title.toString());


  }





}