import { Component, ContentChild,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ApiServicesService } from 'src/app/Services/api-services.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  passwordType:string="password";
  passwordShown: boolean = false;

  username:string|any;
  password:string|any;
  

  constructor( private router:Router,    private menuController: MenuController,  private api: ApiServicesService  ) { }

  ngOnInit() {
  }
  public togglePassword(){
    if(this.passwordShown){
      this.passwordShown = false;
      this.passwordType = 'password';
    }else{
      this.passwordShown = true;
      this.passwordType = 'text';
    }
  }
  onBadgeClick() {
    this.router.navigate(['location-permission']);
  }
  onSubmit(){
    if(this.username=='admin' && this.password=='admin'){
    // this.api.showLoader();
    // this.api.hideLoader();
    this.router.navigate(['/home']);
  //   setTimeout(() => {
  //     this.api.hideLoader();ghvg
  // }, 500);
   }
  }

  ionViewWillEnter() {
    this.menuController.enable(false,'main-menu');
    console.log("fired");
  }

  ionViewWillLeave() {
    this.menuController.enable(true,'main-menu');
    console.log("fired1");
  }

}
