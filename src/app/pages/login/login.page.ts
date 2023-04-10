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
    this.api.showLoader();
    this.router.navigate(['/home']);
    this.api.hideLoader();
   }
  }

  onViewWillEnter() {
    this.menuController.enable(false,'gg');
    console.log("fired");
  }

  ionViewWillLeave() {
    this.menuController.enable(true,'gg');
    console.log("fired1");
  }

}
