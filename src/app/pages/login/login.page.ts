import { Component, ContentChild,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ApiServicesService } from 'src/app/Services/api-services.service';
import { AlertController } from '@ionic/angular';
import { UserAuth } from 'src/app/Model/employee-details';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginData: UserAuth = new UserAuth();
 
  user: UserAuth | any;
  passwordType:string="password";
  passwordShown: boolean = false;
  dataJson!:any;

  username:string|any;
  password:string|any;
  // RememberMe = false;
  data:any;
  userDetails:any=[]
  

  constructor(private router:Router,private menuController: MenuController,  private api: ApiServicesService,private alertController: AlertController,) {

   }

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
 
  // onSubmit(UserName: string, Password: string){
  //   this.api.login(UserName, Password)
  //     .then((response: any) => {
  //       // Handle the response, e.g., store the token, navigate to another page, etc.
  //       console.log('Login response:', response);
  //     })
  //     .catch((error: any) => {
  //       // Handle any error that occurs during the API call
  //       console.error('Login error:', error);
  //     });
  // }
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
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');
    if (storedUsername && storedPassword) {
      this.loginData.UserName=storedUsername;
      this.loginData.UserPassword= storedPassword;
      this.loginData.RememberMe = true;
    }
  }

  ionViewWillLeave() {
    this.menuController.enable(true,'main-menu');
    console.log("fired1");
  }

  onSubmit(){
    console.log(this.loginData.RememberMe)
    const Username = this.loginData.UserName;
    const Userpassword= this.loginData.UserPassword;
    this.api.showLoader()
      this.login();
      if (this.loginData.RememberMe) {
        localStorage.setItem('username', Username);
        localStorage.setItem('password', Userpassword);
      }
      else{
        localStorage.removeItem('username');
        localStorage.removeItem('password');
      }  
      
      this.loginData.resetFields(); 
      this.api.hideLoader();
  }
// login() {
//   console.log(this.loginData)
//   this.api.login(this.loginData).then(
//     (response) => {
//       console.log('Login successful:', response);
//       this.dataJson = JSON.parse(response.data);
//       console.log(this.dataJson);
//       let dummy = this.dataJson['Result'];
//       console.log(dummy);
//       // console.log(this.api.EmployeeId)
//       console.log('UsersId:', dummy['UserId']);
//       console.log('EmployeeId:', dummy['EmployeeId']);
//       this.api.setEmployeeId(dummy['EmployeeId'])
//       this.router.navigate(['/home']);  
//     },
//     (error) => {
//       console.error('Login failed:', error);
//     }
//   );
//   this.performActionBasedOnRole()
// }
  login() {
    console.log(this.loginData)
    this.api.login(this.loginData).then(
      (response) => {
        console.log('Login successful:', response);
        this.dataJson = JSON.parse(response.data);
        console.log(this.dataJson);
        let dummy = this.dataJson['Result'];
        console.log(dummy);
        // console.log(this.api.EmployeeId)
        console.log('UsersId:', dummy['UserId']);
        console.log('EmployeeId:', dummy['EmployeeId']);
        console.log('RoleId:', dummy['RoleId']);
        this.api.setEmployeeId(dummy['EmployeeId'])
        // this.api.setUserRole(dummy['RoleId'])
        this.router.navigate(['/home']); 
        // this.loginData = { UserName: '', UserPassword: '', RememberMe: false }; 
      },
      (error) => {
        console.error('Login failed:', error);
      }
    );
    // this.performActionBasedOnRole()
  }


  // performActionBasedOnRole() {
  //   // Role-based logic here
  //   const selectedRole = this.loginData.role;
  //   if (selectedRole === 'admin') {
  //     // Perform admin-specific action
  //   } else if (selectedRole === 'employee') {
  //     // Perform employee-specific action
  //   } else {
  //     // Perform default action
  //   }
  // }

  
}
