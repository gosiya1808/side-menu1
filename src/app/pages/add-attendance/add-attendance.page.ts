import { Component, OnInit } from '@angular/core';
import { Attendance } from 'src/app/Model/employee-details';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiServicesService } from 'src/app/Services/api-services.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';


@Component({
  selector: 'app-add-attendance',
  templateUrl: './add-attendance.page.html',
  styleUrls: ['./add-attendance.page.scss'],
})
export class AddAttendancePage implements OnInit {
 
  details = new Attendance();
  attendanceGiven = false;
  
  constructor(
    private api:ApiServicesService,
    public modalCtrl: ModalController,
    private router:Router,
    private geolocation: Geolocation,
    private toastController: ToastController,
    private storage: Storage
  ) {
    // this.getCurrentCoordinates();
   }

  onSubmit() {
  //  this.details.Date = new Date().toLocaleDateString();
  //  this.details.StartingTime = new Date().toLocaleTimeString();
    this.api.addAttendance(this.details)
      .then(async response => {
        console.log('added successfully:', response);
        this.api.AttendanceId=JSON.parse(response.data)
        this.api.AttendanceId=this.api.AttendanceId['Result']
        console.log(this.api.AttendanceId)
        const toast = await this.toastController.create({
          message: 'You have attendance successfully!',
          duration: 2000, 
          position: 'bottom' 
        });
        toast.present(); 
        setTimeout(() => {
          this.navigate();
        }, 2000);
        // this.attendanceGiven = true;
        // this.storage.set('attendanceGiven', true);
      })
      .catch(error => {
        console.error('Error adding user:', error);
      });
  }

  navigate(){
    this.router.navigate(['home'])
  }
  async dismiss() {
    return await this.modalCtrl.dismiss();
  }
  getCurrentCoordinates() {
    this.api.showLoader();
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp)
      this.details.InLatitude = resp.coords.latitude;
      this.details.InLongitude = resp.coords.longitude;
      this.api.hideLoader();
     }).catch((error) => {
       console.log('Error getting location', error);
   });
  }

  ngOnInit() {
    // await this.storage.create();
    // this.attendanceGiven = await this.storage.get('attendanceGiven') || false;
  }
}
