


class Prefs{


    showAs?:string;

    vote = {
        min:0,
        max:10,
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
        this.vote.min = 0;
    }

}

class Stats{

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
    loaded?:boolean = false;

    prefs?:Prefs;
    stats?:Stats;


    constructor(){
        this.loaded = false
        this.prefs = new Prefs;
        this.prefs.showAs = "poster"
        
    }



}