import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

// rjxs -->
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
// <--

// Firebase -->
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument, } from '@angular/fire/compat/firestore';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from '@angular/fire/compat/database';
// <-- Firebase

import { User, Settings, Prefs, Stats } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any; // Save logged in user data
  user:User;
  loaded:boolean = false;

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    private db:AngularFireDatabase,

  ) { 

     /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe( (user) => {

      if (user){
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);

        // USER
        let tUser:User = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
    
        };

        this.user = tUser;
        this.GetUser(tUser);
        //console.log(this.user)
        
      } 
      else{
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }

    });

  }

  get userLoaded(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    console.log(user)
    return this.loaded !== false ? true : false;
    
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
    
  }

  // Sign in with Google
  GoogleAuth():Promise<any> {
    console.log(this.constructor.name + ".GoogleAuth()")

    //this.afAuth.signInWithPopup(provider)
    /*
    return this.afAuth.signInWithRedirect(new auth.GoogleAuthProvider()).then(result=>{
      console.log(result)
    });
    */

    return this.afAuth.signInWithPopup(new auth.GoogleAuthProvider()).then(res=>{
      this.afAuth.authState.subscribe((user) => {
        if (user) {
          this.router.navigate(['dashboard']);
        }
      });
    });
  }

  // Sign in with email/password
  SignIn(email:string, password:string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {

        //this.SetUserData(result.user);

        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate(['dashboard']);
          }
        });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Sign up with email/password
  SignUp(email:string, password:string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */
        this.SendVerificationMail();
        this.SetUserData(result.user);
      
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email-address']);
      });
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail:string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
      });

  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user:any) {
    console.log("AuthService.SetUserData()")

    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`

    );

    const userData:User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,

    };

    return userRef.set( userData, {
      merge: true,
    });

  }

  GetUser(user:any){
    console.log("AuthService.GetUser()")

    let userObj = this.db.list( 'users', ref => ref.orderByChild('uid').equalTo( user.uid ) );

    userObj.valueChanges().subscribe( (data) => {

      let foundUser:boolean = false;

      data.forEach(async (u:User) => {
        
        if (u.email == user.email) {
          console.log("found user")
          user.prefs = u.prefs;
          user.settings = u.settings;

          user.loaded = true;
          foundUser = true;

          return user;
        }
      })

      if (!foundUser) {
        this.createUserDB();

      }

      this.loaded = true;

      //this.router.navigate(['dashboard']);

    })
    

  }

  async createUserDB(){
    console.log("AuthService.createUserDB()")

    let uid = this.user.uid;

    // SAVE  
    let user:User = this.user;

    user.prefs = new Prefs;
    user.prefs.showAs = "poster"
    user.settings = new Settings();
    user.stats = new Stats();

    console.log(user)

    this.db.list('users').set(uid, user);
    
  }

  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);

    });

  }

  
}
