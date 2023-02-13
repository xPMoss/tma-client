// Angular
import { Component } from '@angular/core';

// rxjs
import { Observable } from 'rxjs';




@Component({
  selector: 'footer-component',
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  title = 'footer-component';

  isFixed:boolean = false;

  dBody:HTMLElement = document.body;
  footer:HTMLElement;

  constructor(){
    window.addEventListener("resize", (event) => {
      this.setH();
    });

    


  }


  ngOnInit() {
    this.footer = document.getElementById("footer")

    

    



  }


  ngAfterViewInit(){
    this.setH();


  }



  setH(){
    let dbh = this.dBody.clientHeight;
    let condition = window.innerHeight - this.footer.clientHeight;

    /*
    console.log("setH")
    console.log(condition)
    console.log(dbh)
    */

    // If body height > window.height = set footer to relative | else set to fixed
    if(dbh > condition){
      this.footer.style.position = "relative";

    }
    else{
      this.footer.style.position = "fixed";
      this.footer.style.bottom = "0";

    }
    

  }






}
