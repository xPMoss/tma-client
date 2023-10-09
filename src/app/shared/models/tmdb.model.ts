



import { Movie } from "./movie.model";

export class TmdbResult{


    page:number;
    results:TmdbMovie[];
    total_pages:number;
    total_results:number;



}

export class TmdbMovie{

    adult:boolean;
    backdrop_path:string;
    belongs_to_collection?:any[];
    budget?:number;
    genres?:any[];
    genre_ids?:number[];
    homepage?:string;
    id:number;
    imdb_id?:string;
    original_language:string;
    original_title:string;
    overview:string;
    popularity:number;
    poster_path:string;

    production_companies?:any[];
    production_countries?:any[];
    release_date:Date

    revenue?:number;
    runtime?:number;
    spoken_languages?:any[];
    status?:string;
    tagline?:string;
    title:string;
    video:boolean;
    vote_average:number;
    vote_count:number;

    media_type?:string;

}

export class TmdbImages {

    backdrops:any[];
    id:number;
    logos:any[];
    posters:any[];
    
}

export class TmdbKeywords {

    id:number;
    keywords:any[];

}



/*
  "adult": false,
  "backdrop_path": "/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
  "belongs_to_collection": null,
  "budget": 63000000,
  "genres": [
    {
      "id": 18,
      "name": "Drama"
    }
  ],
  "homepage": "http://www.foxmovies.com/movies/fight-club",
  "id": 550,
  "imdb_id": "tt0137523",
  "original_language": "en",
  "original_title": "Fight Club",
  "overview": "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground \"fight clubs\" forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.",
  "popularity": 79.644,
  "poster_path": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
  "production_companies": [
    {
      "id": 508,
      "logo_path": "/7cxRWzi4LsVm4Utfpr1hfARNurT.png",
      "name": "Regency Enterprises",
      "origin_country": "US"
    },
   
  ],
  "production_countries": [
    {
      "iso_3166_1": "US",
      "name": "United States of America"
    }
  ],
  "release_date": "1999-10-15",
  "revenue": 100853753,
  "runtime": 139,
  "spoken_languages": [
    {
      "english_name": "English",
      "iso_639_1": "en",
      "name": "English"
    }
  ],
  "status": "Released",
  "tagline": "Mischief. Mayhem. Soap.",
  "title": "Fight Club",
  "video": false,
  "vote_average": 8.438,
  "vote_count": 27234
*/