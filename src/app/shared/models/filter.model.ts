
export class Option{
    id:number;
    name:string;


}

export class FilterLists{
    id:string;
    show?:boolean = false;
    disabled?:boolean = false;
    active:boolean = false;
    activeFilter?:Filter;

    filters:Filter[];
}

export class Filter{

    id:string;
    type:string;

    options:any[] = [];

    show?:boolean = false;
    disabled?:boolean = false;
    active:boolean = false;
    filterIsAdd:boolean;

    genres:any[] = [];
    keywords:any[] = [];
    votes:any[] = [];
    runtimes:any[] = [];
    providers:any[] = []

    min:number = 0;
    max:number = 10;

    ms:any;

    debug:boolean = false;

    constructor(data){
        this.show = true;
        this.id = data.id;
        this.type = data.type;
        this.ms = data.ms;
        this.filterIsAdd = data.filterIsAdd;

        //console.log("this.ms")
        //console.log(this.ms)

        this.add();

        if(this.debug)console.log(this) // DEBUGGING

        
        
    }

    reset(){
        this.min = 0;
        this.max = 10;

        for (const opt of this.options) {
            opt.active = false;
        }
        
        this.genres = [];
        this.keywords = [];
        this.votes = [];
        this.runtimes = [];
        this.providers = []

        this.options = [];

        this.show = false;
        this.active = false;

        this.add();

    }


    update(){
       


    }

    add(){
        let types;
        let type;
        let name;

        if (this.type == "all") {
            
        }

        if (this.type == "genre" || this.type == "keyword") {
            types = this.type + "s";
            type = this.type + "s";
            name = "name"

        }


        if (this.type == "vote") {
           
        }

        if (this.type == "runtime") {
           
        }

        if (this.type == "provider") {
            types = this.type + "s";
            type = "flatrate";
            name = "provider_name"

        }

        this[types] = [];
        this.options = [];


        for (const m of this.ms.aMovies) {
            if (this.isIterable(m[type])) {
                for (const g of m[type]) {
                    this[types].push(g);
                }
            }

            
        }
       

        // Remove duplicates
        const key = name;
        const unique = [...new Map(this[types].map(item => [item[key], item])).values()]
        this[types] = unique;

        //console.log(this[k])
        this.sortArrayBy(this[types], name, false)

        for (const g of this[types]) {
            this.options.push(g)
        }
    }

    /*
    addGenres(){
        this.genres = [];
        this.options = [];

        for (const m of this.ms.cMovies) {
            if (this.isIterable(m.genres)) {
                for (const g of m.genres) {
                    this.genres.push(g);
                }
            }

            
        }
       
        // Remove duplicates
        const key = 'name';
        const unique = [...new Map(this.genres.map(item => [item[key], item])).values()]
        this.genres = unique;

        //console.log(this.genres)
        this.sortArrayBy(this.genres, 'name', false)

        for (const g of this.genres) {
            this.options.push(g)
        }
     
        //console.log(this.options)
    }

    addKeywords(){
        this.keywords = [];
        this.options = [];

        for (const m of this.ms.cMovies) {
            if (this.isIterable(m.keywords)) {
                for (const k of m.keywords) {
                    this.keywords.push(k);
                }
            }

        }
       
        // Remove duplicates
        const key = 'name';
        const unique = [...new Map(this.keywords.map(item => [item[key], item])).values()]
        this.keywords = unique;

        //console.log(this.keywords)
        this.sortArrayBy(this.keywords, 'name', false)

        for (const k of this.keywords) {
            this.options.push(k)
        }
     
        console.log(this.options)

    }

    addVotes(){

    }

    addRuntimes(){

    }

    addProviders(){
        this.providers = [];
        this.options = [];

        for (const m of this.ms.cMovies) {
            
            if (this.isIterable(m.flatrate)) {
                for (const p of m.flatrate) {
                    this.providers.push(p);
                }
            }
            
        }
       
        // Remove duplicates
        const key = 'provider_name';
        const unique = [...new Map(this.providers.map(item => [item[key], item])).values()]
        //this.providers = unique;

        console.log(this.providers)
        this.sortArrayBy(this.providers, 'provider_name', false)

        for (const k of this.providers) {
            this.options.push(k)
        }
     
        console.log(this.options)


    }
    */

    // Sort
    sortArrayBy(array, field, reverse){

        array.sort( (a, b)=> {

        if (a[field] < b[field]){
            let val = -1;
            if(reverse){ 
            val = 1;
            };
            return val;
        }
            
            
        if (a[field] > b[field]){
            let val = 1;
            if(reverse){ 
            val = -1;
            };
            return val;
        }
            
        return 0;

        })

    }

    isIterable(input) {  
        if (input === null || input === undefined) {
          return false
        }
      
        return typeof input[Symbol.iterator] === 'function'
    }


}