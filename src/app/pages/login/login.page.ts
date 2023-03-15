import { Component, ContentChild,OnInit } from '@angular/core';
import { Router } from '@angular/router';


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

  constructor( private router:Router) { }

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
    if(this.username=='admin@gmail.com' && this.password=='admin12345'){
    this.router.navigate(['/home']);
   }
  }

}
