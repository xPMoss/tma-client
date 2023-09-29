import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from "./pages/home/home.component";
import { MovieComponent } from "./pages/movies/movies.component";
import { MovieDetailComponent } from "./pages/movie-detail/movie-detail.component";
import { ListComponent } from "./pages/list/list.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { SettingsComponent } from "./pages/settings/settings.component";
import { DiscoverComponent } from "./pages/discover/discover.component";
import { SearchPageComponent } from "./pages/search-page/search-page.component";

// -->
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
// <--

// route guard
import { AuthGuard } from './shared/guard/auth.guard';

const routes: Routes = [
  { path:"", component: HomeComponent, data: { title: "Home" } },
  { path:"home", component: HomeComponent, data: { title: "Home" } },
  { path:"movies", component: MovieComponent, data: { title: "Movies" }, canActivate: [AuthGuard] },
  { path:"movie/:id", component: MovieDetailComponent, data: { title: "Movie details" }},
  { path:"lists", component: ListComponent, data: { title: "Lists" }, canActivate: [AuthGuard] },
  { path:"list/:name", component: ListComponent, data: { title: "List details" }, canActivate: [AuthGuard] },
  { path:"profile", component: ProfileComponent, data: { title: "Profile" }, canActivate: [AuthGuard] },
  { path:"settings", component: SettingsComponent, data: { title: "Settings" }, canActivate: [AuthGuard] },
  { path:"search", component: SearchPageComponent, pathMatch: 'full', data: { title: "Search" }, canActivate: [AuthGuard] },
  { path:"discover", component: DiscoverComponent, data: { title: "Discover" } },

  { path: 'dashboard', component: DashboardComponent, data: { title: "Dashboard" }, canActivate: [AuthGuard] },

  { path: 'sign-in', component: SignInComponent, data: { title: "Sign in" } },
  { path: 'register-user', component: SignUpComponent, data: { title: "Register" } },
  { path: 'forgot-password', component: ForgotPasswordComponent, data: { title: "Reset password" } },
  { path: 'verify-email-address', component: VerifyEmailComponent, data: { title: "Verify email address" } },

];

@NgModule({
  //imports: [RouterModule.forRoot(routes)],
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
