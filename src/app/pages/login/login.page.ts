import { Component, ContentChild,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ApiServicesService } from 'src/app/Services/api-services.service';
import { AlertController } from '@ionic/angular';


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
  rememberMe = false;
  

  constructor( private router:Router,    private menuController: MenuController,  private api: ApiServicesService,private alertController: AlertController  ) { }

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
    this.rememberMe = true;
  //   setTimeout(() => {
  //     this.api.hideLoader();ghvg
  // }, 500);
   }
  }
  async showAlertF() {
    const alert = await this.alertController.create({
      header: 'INVAILD',
      message: 'EMAIL or Password is wrong',
      buttons: ['OK']
    });
     await alert.present();
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
