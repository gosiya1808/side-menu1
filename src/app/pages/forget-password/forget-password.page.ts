import { Component, OnInit } from '@angular/core';
import { ApiServicesService } from 'src/app/Services/api-services.service';


@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage implements OnInit {

  EmployeeId!: number;
  code!: string;
  id=this.api.getEmployeeId();
  email!: string;
  user!: string;
  password!: string;

  verificationResult: any;
  randomString: any;
  userDetails: any;
  passwordUpdateResult: any;
  detailsJson: any;
  details: any;

  constructor(private api: ApiServicesService) { }


  verifyCodes() {
    this.api.verifyCode(this.code,this.EmployeeId)
      .then(
        (response) => {
          console.log(response)
          this.detailsJson = JSON.parse(response.data);
          console.log(this.detailsJson);
          this.details = this.detailsJson['Result'];
          console.log(this.details)
        },
        (error) => {
          console.log("error in varifying code", error);
        }
      );
  }

  getRandomString() {
    this.api.getRandomString(this.id)
      .then(
        (response) => {
          console.log(response)
          this.randomString = response;
          this.detailsJson = JSON.parse(response.data);
          console.log(this.detailsJson);
          this.details = this.detailsJson['Result'];
          console.log(this.details)
        },
        (error) => {
          console.log("error getting data", error);
        }
      );
  }

  getUsersDetails() {
    this.api.getUsersDetails(this.email)
      .then(
        (response) => {
          console.log(response)
          this.userDetails = response;
          this.detailsJson = JSON.parse(response.data);
          console.log(this.detailsJson);
          this.details = this.detailsJson['Result'];
          console.log(this.details)
          const id = this.details[0]['Id']
          console.log(id);
        },
        (error) => {
          console.log("error getting data", error);
        }
      );
  }

  updatePassword() {
    this.api.updatePassword(this.user)
      .then(
        (response) => {
          console.log(response)
          this.passwordUpdateResult = response;
          this.detailsJson = JSON.parse(response.data);
          console.log(this.detailsJson);
          this.details = this.detailsJson['Result'];
          console.log(this.details)
        },
        (error) => {
          console.log("error getting data", error);
        }
      );
  }

  ngOnInit() {
  }

}
