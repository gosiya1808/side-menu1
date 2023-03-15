import { Component, OnInit } from '@angular/core';
import { Attendance } from 'src/app/Model/employee-details';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiServicesService } from 'src/app/Services/api-services.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';


@Component({
  selector: 'app-add-attendance',
  templateUrl: './add-attendance.page.html',
  styleUrls: ['./add-attendance.page.scss'],
})
export class AddAttendancePage implements OnInit {
 
  details = new Attendance();
  
  constructor(
    private api:ApiServicesService,
    public modalCtrl: ModalController,
    private router:Router,
    private geolocation: Geolocation
  ) {
    this.getCurrentCoordinates();
   }

  onSubmit() {
  //  this.details.Date = new Date().toLocaleDateString();
  //  this.details.StartingTime = new Date().toLocaleTimeString();
    this.api.addAttendance(this.details)
      .then(response => {
        console.log('added successfully:', response);
        this.api.AttendanceId=JSON.parse(response.data)
        this.api.AttendanceId=this.api.AttendanceId['Result']
        console.log(this.api.AttendanceId) 
      })
      .catch(error => {
        console.error('Error adding user:', error);
      });
  }

  navigate(){
    this.router.navigate(['attendance'])
  }
  async dismiss() {
    return await this.modalCtrl.dismiss();
  }
  getCurrentCoordinates() {
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp)
      this.details.InLatitude = resp.coords.latitude;
      this.details.InLongitude = resp.coords.longitude;
     }).catch((error) => {
       console.log('Error getting location', error);
   });
  }

  ngOnInit() {
  }
}
