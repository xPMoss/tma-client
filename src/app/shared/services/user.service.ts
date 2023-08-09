// Angular
import { Injectable } from '@angular/core';

// rxjs
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

// firebase
import { AngularFireDatabase, AngularFireObject, AngularFireList } from '@angular/fire/compat/database';

// Models
import { User } from "../models/user.model";


@Injectable({ providedIn: 'root' })
export class UserService {

    users:AngularFireList<User>;
    user:User;

    debug:boolean = false;

    constructor( private db:AngularFireDatabase) {
        if(this.debug)console.log("UserService()") // DEBUGGING

        /*
        this.db.list( 'users' ).valueChanges().subscribe( async (data) => {
            if(this.debug)console.log("Users") // DEBUGGING
            if(this.debug)console.log(data) // DEBUGGING

            for await (const d of data) {
                let user:any = d;

                if (user.email=="patrik.mossberg@gmail.com") {
                    this.user = user;
                    if(this.debug)console.log(this.user) // DEBUGGING
                    
                }
                
                
                
                
            }
        })
        */

    }


      /////////
  // PUT //
  async setItem(item:any) {
    //console.log("UserService.setItem()")
    //console.log(item.uid)

    await this.db.list('users').update(item.uid, item)
    
  }







}