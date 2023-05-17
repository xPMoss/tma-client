

import { Movie } from "./movie.model";


 
export class List{

    id:number;
    title?:string;
    info?:string;
    description?:string;
    
    movies?:Movie[] = [];

    show?:boolean = false;

    constructor(){
        this.show = false;
        this.movies = [];
        
    }



}