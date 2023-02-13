import { Component } from '@angular/core';





@Component({
  selector: 'to-top-component',
  templateUrl: './to-top.component.html',
  styles: [`
    #totop {
        cursor:pointer;
        user-select: none;
        position:fixed;
        bottom:2rem;
        right:2rem;

        width:6rem;
        height:6rem;
        opacity:0.9;

    }
    
  `]
})
export class ToTopComponent {
  title = 'to-top-angular';


    show:boolean = false;

    constructor(){
        window.addEventListener("scroll", ()=>{
            
            if (window.scrollY > 10) {
                this.show = true;
            }
            else{
                this.show = false
            }
        })
    }
    

    toTop(){
        window.scroll({ 
            top: 0, 
            left: 0, 
            behavior: 'smooth' 
        });

        

    }
}
