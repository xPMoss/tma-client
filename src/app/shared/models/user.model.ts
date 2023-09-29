
export class Settings{

    ageRating?:number;

    constructor(){
        this.ageRating = 18;

     }
}


export class Prefs{

    showAs?:string;
    showMoviesAs?:string;
    UISide?:string;

    vote = {
        min:0,
        max:10,
    }

    favorite = {
        movies:[],
        genres:[],
        keywords:[],
    }

    liked = {
        movies:[],
        genres:[],
        keywords:[],
    }

    disliked = {
        movies:[],
        genres:[],
        keywords:[],
    }

    owned = {
        movies:[],
        providers:[],

    }


    constructor(){
    
    }

}

export class Stats{

    liked = {
        movies:[],
        genres:[],
        keywords:[],
    }

    disliked = {
        movies:[],
        genres:[],
        keywords:[],
    }
    


    constructor(){
       
    }

}


export class User{

    uid: string;
    id?:number;
    email?:string;

    displayName: string;
    photoURL: string;
    emailVerified: boolean;
    
    certification?:number;

    name?:string;
    age?:number;

    loaded?:boolean = false;

    settings?:Settings = new Settings();
    prefs?:Prefs;
    stats?:Stats;


    constructor(){
        this.loaded = false
        this.prefs = new Prefs;
        this.prefs.showAs = "poster"

       
        
    }



}