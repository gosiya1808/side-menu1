import { Component, } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  number = document.getElementById("number");
  counter = 0;
  // // setInterVal:any(()=>{
  //   if(counter == 65){
  //     clearInterval();
  //   }else{
  //     counter += 1;
  //     number.innerHTML = counter + "%";
  //   }
      
  // // }, 30)

  constructor() {}

  

}
