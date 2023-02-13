// Angular
import { Component } from '@angular/core';

// rxjs
import { Observable } from 'rxjs';


import { UserService } from "../../shared/services/user.service";


@Component({
  selector: 'profile-component',
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  title = 'profile-component';



  constructor(public us:UserService){



  }


  ngOnInit() {

  }






}
