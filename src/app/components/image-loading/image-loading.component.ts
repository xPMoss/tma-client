import { Component, Input } from '@angular/core';

@Component({
  selector: 'image-with-loading',
  templateUrl: './image-loading.component.html',
})
export class ImageLoadingComponent {

  @Input() loader:string = 'https://via.placeholder.com/200x300';
  @Input() height:number = 200;
  @Input() width:number = 200;
  @Input() image:string;

  isLoading:boolean;
  
  constructor() { 
    this.isLoading = true;
  }

  hideLoader(){
    this.isLoading = false;
  }

}