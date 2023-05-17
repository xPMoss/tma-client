




import { Movie } from "./movie.model";


export class Result{

    page:number = 1;
    total_pages:number;
    total_results:number;

    results:any[] = new Array();

    
    
    movies:number;
    pages:number = 1;
    current_page:number = 1;
    min:number = 0;
    max:number = 20;

    constructor(){

    }

    navigate(dir:number){

       if (dir < 1) {
            this.min -= 20
            this.max -= 20;
       }
       else{
        this.min += 20
        this.max += 20;
       }

       window.scroll({ 
            top: 0, 
            left: 0, 
            behavior: 'auto' 
        });

    }


}