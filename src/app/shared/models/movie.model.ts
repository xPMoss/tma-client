
import { catchError, delay } from "rxjs";
import { UserService } from "../services/user.service";
import { MovieService } from "../services/movie.service";
import { TmdbService } from "../services/tmdb.service";

import { HttpClient } from '@angular/common/http';


interface ProductionCompany{

    id:number;
    name:string
    logo_path:string;
    origin_country:string;

    //{"id":508,"logo_path":"/7cxRWzi4LsVm4Utfpr1hfARNurT.png","name":"Regency Enterprises","origin_country":"US"},

}

interface ProductionCountry{

    name:string;
    iso_3166_1:string;


    //{"iso_3166_1":"DE","name":"Germany"},{"iso_3166_1":"US","name":"United States of America"}
}

interface SpokenLanguage{

    name:string
    english_name:string;
    iso_639_1:string;
    

    //{"english_name":"English","iso_639_1":"en","name":"English"}

}


export interface Genre{
    id:number;
    name:string;

    active?:boolean;
    disabled?:boolean;

}

interface Provider{
    display_priority:number;
    logo_path:string;
    provider_id:number;
    provider_name:string;

    active?:boolean;
    disabled?:boolean;

    
}

interface Image{
    aspect_ratio:number;
    height:number;
    width:number;

    iso_639_1:string;

    file_path:string;

    vote_average:number;
    vote_count:number;

    //{"aspect_ratio":0.667,"height":1500,"iso_639_1":"en","file_path":"/1gu7SJN5wQR0smkMPjo9bUoFXL7.jpg","vote_average":5.318,"vote_count":3,"width":1000},
}

export interface ReleaseDate{

    certification?:string;
    iso_639_1?:string;
    release_date?:Date;

    type?:number;
}

// Country
export interface Country{
    iso_3166_1?:string;
    release_dates?:ReleaseDate[];

}

export class Certification{
    countries?:Country[]

    avg_rating:number;

    debug:boolean = false;

    constructor(){



    }

    setAvgCertification(){

        if(this.debug)console.log("Certification.setAvgCertification()")
        if(this.debug)console.log(this.countries)

        let score:number[] = new Array;
        let total:number = 0;
        let avg:number = 0;

        let cDebugText = "";
        let debugText = "";

        this.countries.forEach(country => {
            let cScore:number[] = new Array;
            let cResult:number = 0;
            let cAvg:number = 0;

            cDebugText += country.iso_3166_1 + ':[ ';
            
            country.release_dates.forEach( rd => {
                if (rd.certification) {
                    let res:number = null;

                    if (country.iso_3166_1=='AU') {
                        res = this.calcAU(rd.certification);
                    }
                    else if (country.iso_3166_1=='DE') {
                        res = this.calcDE(rd.certification);
                    }
                    else if (country.iso_3166_1=='FI') {
                        res = this.calcFI(rd.certification);
                    }
                    else if (country.iso_3166_1=='FR') {
                        res = this.calcFR(rd.certification);
                    }
                    else if (country.iso_3166_1=='NO') {
                        res = this.calcNO(rd.certification);
                    }
                    else if (country.iso_3166_1=='SE') {
                        res = this.calcSE(rd.certification);
                    }
                    else if (country.iso_3166_1=='US') {
                        res = this.calcUS(rd.certification);
                    }
                    else{
                        res = null;
                    }

                    

      
                    // Has return value
                    if (!isNaN(res) && res != undefined && res != null) {
                        //if(this.debug)console.log("Is number")
                        //if(this.debug)console.log(country.iso_3166_1 +  ' . ' + res)
                        cDebugText += res.toString() + '';
                        cScore.push(res)
                    }
                    else{
                        //if(this.debug)console.log("Not number!")
                        //if(this.debug)console.log(country.iso_3166_1 +  ' . ' + res)
                    }

                    cDebugText +=  '(' + rd.certification + '), ';
                    

                }
            });

            

            cScore.forEach(s => {
                cResult += s;
            });

            if (cScore.length > 0) {
                cAvg = cResult/cScore.length;
                score.push(cAvg);
            }
            

            cDebugText += ']'
            cDebugText += '.[total:' + cResult + ']'
            cDebugText += '.[length:' + cScore.length + ']'
            cDebugText += '.[cAvg:' + cAvg + ']'
            cDebugText += '\n'

        });

        

        if(this.debug)debugText += 'Result:['

        score.forEach(cs => {
            if(this.debug)debugText += cs + ', '
            total += cs;
        });

        avg = total/score.length;

        
        if(this.debug)debugText += ']'
        if(this.debug)debugText += '.[total:' + total + ']'
        if(this.debug)debugText += '.[length:' + score.length + ']'
        if(this.debug)debugText += '.[result:' + avg + ']'

        if(this.debug)console.log(cDebugText)
        if(this.debug)console.log(score)
        if(this.debug)console.log(debugText)

        
        // Set result of calc
        let result:number = this.setAvg(avg);
        this.avg_rating=Math.round(result)

    }

    setAvg(avg){
        /*
        0
        6
        7
        9
        10
        11
        12
        13
        15
        16
        17
        18
        */
        let result:number;

        if (avg < 6) {
            result = 0;
        }
        else if(avg >= 6 && avg < 7){
            result = 6;
        }
        else if(avg >= 7 && avg < 9){
            result = 7;
        }
        else if(avg >= 9 && avg < 10){
            result = 9;
        }
        else if(avg >= 10 && avg < 11){
            result = 10;
        }
        else if(avg >= 11 && avg < 12){
            result = 11;
        }
        else if(avg >= 12 && avg < 13){
            result = 12;
        }
        else if(avg >= 13 && avg < 15){
            result = 13;
        }
        else if(avg >= 13 && avg < 15){
            result = 13;
        }
        else if(avg >= 15 && avg < 16){
            result = 15;
        }
        else if(avg >= 16 && avg < 17){
            result = 16;
        }
        else if(avg >= 17 && avg < 18){
            result = 17;
        }
        else{
            result = 18;
        }

         return result;
    }

    calcAU(cert){
        let rate:number = null;

        // "For all ages."
        if (cert=="G") {
            rate=0;
        }


        if (cert=="PG") {
            rate=10;

        }

        if (cert=="M") {
            rate=13;
        }

        // "Over 15 years."
        if (cert=="MA15+") {
            rate=15;
        }

        // "Adults only."
        if (cert=="X18+" || cert=="R18+") {
            rate=18;
        }

        // "Banned from commercial distribution."
        if (cert=="RC" || cert=="E") {
            //rate=666;
        }

        return rate;




    }

    calcFI(cert){
        let rate:number = null;

        // "For all ages."
        if (cert=="S") {
            rate=0;
        }

        // "Over 7 years."
        if (cert=="K-7") {
            rate=7;
        }

        // "Over 12 years."
        if (cert=="K-12") {
            rate=12;
        }

        // "Over 16 years."
        if (cert=="K-16") {
            rate=16;
        }

        // "Adults only."
        if (cert=="K-18") {
            rate=18;
        }

        // "Banned from commercial distribution."
        if (cert=="KK") {
            //rate=666;
        }

        return rate;


    }

    calcUS(cert){
        let rate:number = null;

        if (cert=="G") {
            rate=0;
        }

        if (cert=="PG") {
            rate=10;
        }

        if (cert=="PG-13") {
            rate=13;
        }

        if (cert=="R" || cert=="NC-17") {
            rate=17;
        }



        return rate;

        /*



        */




    }

    calcSE(cert){
        let rate:number = null;

        if (cert=="Btl") {
            rate=0;
        }

        if (cert=="7") {
            rate=7;
        }

        if (cert=="11") {
            rate=11;
        }

        if (cert=="15") {
            rate=15;
        }

        if (cert=="18") {
            rate=18;
        }



        return rate;

        /*




        */




    }

    calcNO(cert){
        let rate:number = null;

        if (cert=="A") {
            rate=0;
        }

        if (cert=="6") {
            rate=6;
        }

        if (cert=="9") {
            rate=9;
        }

        if (cert=="12") {
            rate=12;
        }

        if (cert=="15") {
            rate=15;
        }

        if (cert=="18") {
            rate=18;
        }





        return rate;

        /*




        */




    }

    calcDE(cert){
        let rate:number = null;

        if (cert=="A") {
            rate=0;
        }

        if (cert=="6") {
            rate=6;
        }

        if (cert=="12") {
            rate=12;
        }

        if (cert=="16") {
            rate=16;
        }

        if (cert=="18") {
            rate=18;
        }



        return rate;



    }

    
    calcFR(cert){
        let rate:number = null;

        if (cert=="U") {
            rate=0;
        }

        if (cert=="10") {
            rate=10;
        }

        if (cert=="12") {
            rate=12;
        }

        if (cert=="16") {
            rate=16;
        }

        if (cert=="18") {
            rate=18;
        }



        return rate;






    }

    calcGB(cert){
        let rate:number = null;

        if (cert=="U") {
            rate=0;
        }

        if (cert=="PG") {
            rate=0;
        }

        if (cert=="12") {
            rate=12;
        }

        if (cert=="15") {
            rate=15;
        }

        if (cert=="12A") {
            rate=18;
        }

        if (cert=="R18") {
            rate=18;
        }


        return rate;



    }



}

export interface Keyword{
    id?:number;
    name?:string;


}

class Timer{
    startCount:any;

    counter:number = 0;
    timing:number = 0;

    nIntervId:any;

    isEven:boolean = false;


    count() {
        this.counter++;


        
        //console.log("timer")
        //console.log(typeof this.counter)
        //console.log(this.counter)
        //console.log()
    }

    constructor(){
        //console.log("timer")
        //this.nIntervId = setInterval(this.count, 1000);

        var clock = () =>{
            this.counter++
            this.timing++

            if (this.timing > 100) {
                this.timing = 0;
            }

            if (this.counter % 2 == 0){
                this.isEven = true;
            }    
            else{
                this.isEven = false;
            }

            
                

            //console.log("timer")
            //console.log(typeof this.counter)
            //console.log(this.counter)
        };

        this.nIntervId = setInterval(clock, 100);
        


    }

    start(){
        console.log("timer.start()")
        this.nIntervId = setInterval(this.count, 1000);
    }



    stop(){
        console.log("timer.stop()")
        clearInterval(this.nIntervId)
    
    }


    reset(){
        console.log("timer.reset()")
        clearInterval(this.nIntervId)
        this.counter = 0;
        this.timing = 0;
    }


}

export class Movie{

    // id:s
    id:number;
    imdb_id?:number;
    
    // titles
    title?:string;
    original_title?:string;

    genres?:Genre[];
    adult?:boolean;
    belongs_to_collection?:null;
    original_language?:string;
    
    // description
    overview?:string;
    tagline?:string;
    keywords?:Keyword[];

    // images
    backdrop_path?:string;
    poster_path?:string;
    posters?:Image[];
    backdrops?:Image[];

    // Providers
    flatrate?:Provider[];

    // time
    release_date?:Date;

    release_dates?:Country[];
    runtime?:number;

    buddget?:number;
    revenue?:number;

    status?:"Released"|"Unreleased";
    production_companies?:ProductionCompany[];
    production_countries?:ProductionCountry[];
    spoken_languages?:SpokenLanguage[];

    vote_average?:number;
    vote_count?:number;

    // user varibles
    saved?:boolean;
    favorite?:boolean;
    seen?:boolean;
    vote?:number|null;
    lists?:string[] = [];
    watch?:boolean;
    certifications?:Certification;
    length?:string;
    tags?:Keyword[];

    recommendedMovies?:Movie[];
    similarMovies?:Movie[];

    base_url?:string  = "https://image.tmdb.org/t/p/";  

    http:HttpClient;

    tmdb:TmdbService;
    ms?:MovieService;
    us?:UserService;

    preloading?:boolean = true;
    loading?:boolean = true;
    poster_loading?:boolean = true;
    backdrop_loading?:boolean = true;
    posters_loading?:boolean = true;
    backdrops_loading?:boolean = true;
    
    show?:boolean = false;

    placeholder_url?:string = "https://via.placeholder.com/";

    
    timer:Timer;
    

    constructor(data){
        //console.log("Movie.constructor()")
        
        if(data.title == "Medieval"){
            
        }

        this.timer = new Timer();
        

        this.tmdb = new TmdbService(this.http);

        // LOADING
        this.preloading = true;
        this.loading = true;
        this.poster_loading = true;
        this.backdrop_loading = true;
        this.posters_loading = true;
        this.backdrops_loading = true;
        

        this.id = data.id;
        this.saved = data.saved;
        this.seen = data.seen;
        this.title = data.title;
        this.lists = data.lists;
        this.vote = data.vote;

        this.preloading = false;

        

    }

    // Load and init tmdb data
    async init?(){
        let providers = await this.tmdb.getWatchProvidersTMDB(this.id).then( (data)=> {
            // Merge objects
            
            let providers = data
            const obj = { ...this, ...providers };
            return obj;
        });
        this.flatrate = providers.flatrate;

        let data = await this.tmdb.getDetailsTmdb(this.id);
        this.poster_path = data.poster_path;
        this.poster_loading = false;

        this.backdrop_path = data.backdrop_path
        this.backdrop_loading = false;

        this.overview = data.overview
        this.title = data.title;
        this.genres = data.genres;
        this.runtime = data.runtime;
        this.length = this.timeConvert(this.runtime)

        this.tagline = data.tagline;
        this.vote_count = data.vote_count;

        let vote = data.vote_average/2
        this.vote_average = Math.round(vote);

        let keywords = await this.tmdb.getKeywordsTmdb(this.id);
        this.keywords = keywords.keywords;


        let images = await this.tmdb.getImagesTmdb(this.id);
        //console.log(images)

        if (images) {
            let backdrops = images.backdrops;
            this.backdrops = [];

            if (backdrops.length > 0) {
                backdrops.forEach(img => {
                    let newImg:Image = img;
                    this.backdrops.push(newImg)
                });

                this.backdrops_loading = false;
            }

        }
        
        
        
        //let base = "https://via.placeholder.com/";
        //let image = "200x300";
        //https://via.placeholder.com/800x600?text=TEXT_ON_IMAGE

        this.loading = false;

        // Debug
        //this.loading = true;
        
        this.posters_loading = false;
        this.poster_loading = false;
        this.backdrop_loading = false;
        this.backdrops_loading = false;
        

        if(!this.loading){
            this.timer.stop()

        }
        
        return true;

        //console.log(this)
    }

    // Check age rating
    async checkRating?(){
        //console.log("Movie.checkRating()")
        //console.log(this.id)

        let show = false;
        let debugStr = "";

        let certifications = await this.tmdb.getReleaseDatesTmdb(this.id);


        //console.log(certifications)

        if (certifications.results) {
            //console.log("Certify")
            await this.setCert(certifications);

            if (this.certifications.avg_rating > 18) {
                debugStr += "ADULT:[" + this.title + "]"
                
                
            }
            else{
                debugStr += "CHILD:[" + this.title + "]"
                show = true;
                
            }

        }

        //console.log(debugStr)
        return show;

    }

    // Set certifications
    async setCert?(certifications){

        let res = certifications.results;
        //console.log(res)

        let release_dates:Country[] = new Array;

        res.forEach(cert => {
          if (cert.iso_3166_1 == "AU") {
            //console.log("SE rating")
            let FR:Country = cert;
            release_dates.push(FR)

          }

          if (cert.iso_3166_1 == "DE") {
            //console.log("SE rating")
            let DE:Country = cert;
            release_dates.push(DE)

          }

          if (cert.iso_3166_1 == "GB") {
            //console.log("SE rating")
            let GB:Country = cert;
            release_dates.push(GB)

          }

          if (cert.iso_3166_1 == "FI") {
            //console.log("SE rating")
            let FI:Country = cert;
            release_dates.push(FI)

          }

          if (cert.iso_3166_1 == "FR") {
            //console.log("SE rating")
            let FR:Country = cert;
            release_dates.push(FR)

          }


          if (cert.iso_3166_1 == "NO") {
            //console.log("SE rating")
            let NO:Country = cert;
            //console.log(cert.release_dates)
            release_dates.push(NO)

          }

          if (cert.iso_3166_1 == "SE") {
            //console.log("SE rating")
            let SE:Country = cert;
            release_dates.push(SE)

          }

          if (cert.iso_3166_1 == "US") {
            //console.log("US rating")
            let US:Country = cert;
            release_dates.push(US)
            
       
          }

        });

        if (release_dates) {
            this.release_dates = release_dates;
            this.certifications = new Certification();
            this.certifications.countries = release_dates;
            this.certifications.setAvgCertification();
            //console.log(this)
        }



    }

    timeConvert?(n) {
        var num = n;
        var hours = (num / 60);
        var rhours = Math.floor(hours);
        var minutes = (hours - rhours) * 60;
        var rminutes = Math.round(minutes);
        return rhours + "h " + rminutes + "min";
    }

    *clock?(){
        console.log('Tick!');
        while (true) {
            yield;
            console.log('Tick!');
            yield;
            console.log('Tock!');
        }
    };
}

