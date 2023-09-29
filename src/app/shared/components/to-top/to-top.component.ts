import { Component } from '@angular/core';





@Component({
  selector: 'to-top-component',
  templateUrl: './to-top.component.html',
  styles: [`
    #totop {
        cursor:pointer;
        user-select: none;
        position:fixed;
        /*bottom:4rem;
        right:4rem;*/

        /*opacity:1;*/

    }
    #totopbtn{


    }
    
  `]
})
export class ToTopComponent {
  title = 'to-top-angular';

    window = {
        w:0,
        h:0
    };

    w:number = 32;
    h:number = 32;

    r:number = 4;
    b:number = 4;

    breakpoints = {
        xs: 0,
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200,
        xxl: 1400
    };

    show:boolean = false;


    constructor(){
        this.window.h = window.innerHeight;
        this.window.w = window.innerWidth;
        
        //console.log("change size of window")
        //console.log(this.window.w)

        this.setSeizes();

       
        window.addEventListener("resize", ()=>{
            this.window.h = window.innerHeight;
            this.window.w = window.innerWidth;

            //console.log("change size of window")
            //console.log(this.window.w)

            this.setSeizes();

        });

        

        window.addEventListener("scroll", ()=>{
            
            if (window.scrollY > 10) {
                this.show = true;
            }
            else{
                this.show = false;
            }
        })
    }
    
    setSeizes(){
        this.r = 4;
        this.b = 4;

        this.w = 64;
        this.h = 64;

        if (this.window.w <= this.breakpoints.lg) {
            this.r = 4;
            this.b = 4;

            this.w = 64;
            this.h = 64;

            if (this.window.w <= this.breakpoints.md) {
                this.r = 3;
                this.b = 4;

                this.w = 32+16;
                this.h = 32+16;

                if (this.window.w <= this.breakpoints.sm) {
                    this.r = 2;
                    this.b = 4;

                    this.w = 32+16;
                    this.h = 32+16;


            
                }
            }
        }

        

    }

    toTop(){
        window.scroll({ 
            top: 0, 
            left: 0, 
            behavior: 'smooth' 
        });

        

    }

    animateToTop(event){
        let element = event.target;
        console.log(event)

        let anim = element.animate([
            { // from
      
            },
            { // to
                transform: "rotate3d(0, 1, 0, 90deg)",
                boxShadow: "0rem 1rem 1rem rgba(0,0,0, 1)",
            }
            ], 
            {
                fill: 'forwards',
                easing: 'ease',
                duration: 100
            });



    }
    
    // Called before ngOnInit()
    ngOnChanges(){
      
    }

    // Called once, after the first ngOnChanges() (if the component has bound inputs) and whenever one or more data-bound input properties change.
    ngOnInit(){
        /*
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        document.getElementById("totopbtn").appendChild(svg);


        let sg = document.getElementById("totop");

        console.log(sg)

        sg.style.width = this.w;
        sg.style.height = this.h;
        */
    }

    ngAfterViewChecked(){
       

    }



}
