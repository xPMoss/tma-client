// Angular -->
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {FormControl, Validators, ReactiveFormsModule} from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
// <-- Angular

import { BootstrapIconsModule } from 'ng-bootstrap-icons';
import { Alarm, App, Bookmark, Trash, X, ArrowBarUp, ArrowUpSquare } from 'ng-bootstrap-icons/icons';

// Select some icons (use an object, not an array)
const icons = {
  Alarm,
  App,
  Bookmark,
  Trash,
  X,
  ArrowBarUp,
  ArrowUpSquare
};

// Angular/routing -->
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// <-- Angular/routing

// Environment variabels
import { environment as env } from '../environments/environment';

// Firebase -->
// Import the functions you need from the SDKs you need
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
// <-- Firebase

// Shared components -->
import { NavigationComponent } from "./shared/components/navigation/navigation.component";
import { HeaderComponent } from "./shared/components/header/header.component";
import { FooterComponent } from "./shared/components/footer/footer.component";
import { ToTopComponent } from "./shared/components/to-top/to-top.component";
// <-- Shared components

// Components -->
import { HomeComponent } from "./pages/home/home.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { DiscoverComponent } from "./pages/discover/discover.component";
import { ListComponent } from "./pages/list/list.component";
import { MovieComponent } from "./pages/movies/movies.component";
import { MovieDetailComponent } from "./pages/movie-detail/movie-detail.component";

import { FilterComponent } from "./components/filter/filter.component";
import { ImageLoadingComponent } from "./components/image-loading/image-loading.component";

import { SearchResultComponent } from "./shared/components/search-result/search-result.component";
import { SearchFieldComponent } from "./shared/components/search-field/search-field.component";
import { SearchPageComponent } from "./pages/search-page/search-page.component";
// <-- Components

// Auth components -->
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
// Auth components <--

// Bootstrap -->
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
// <-- Bootstrap

// Services -->
import { AuthService } from "./shared/services/auth.service";
import { TmdbService } from "./shared/services/tmdb.service";
import { MovieService } from "./shared/services/movie.service";
import { SearchService } from "./shared/services/search.service";
import { UserService } from "./shared/services/user.service";
import { DiscoverService } from "./shared/services/discover.service";
import { MsgService } from "./shared/services/msg.service";
// <-- Services

// Models -->
import { Result } from "./shared/models/result.model";
import { Movie } from "./shared/models/movie.model";



// <-- Models

@NgModule({
  declarations: [
    AppComponent,
    // -->
    NavigationComponent,
    HeaderComponent,
    FooterComponent,
    ToTopComponent,
    // <--
    // -->
    HomeComponent,
    ProfileComponent,
    DiscoverComponent,
    MovieComponent,
    MovieDetailComponent,
    ListComponent,
    // <--
    FilterComponent,
    ImageLoadingComponent,
    SearchResultComponent,
    SearchFieldComponent,
    SearchPageComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    DashboardComponent
    //-->

    //<--

  ],
  imports: [
    // Firebase modules -->
    AngularFireModule.initializeApp(env.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    // <-- Firebase modules
    AppRoutingModule,
    NgbModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BootstrapIconsModule.pick(icons)

    
  ],
  exports: [BootstrapIconsModule],
  providers: [AuthService, UserService, TmdbService, MovieService, SearchService, DiscoverService, MsgService,],
  bootstrap: [AppComponent]
})
export class AppModule {



}
