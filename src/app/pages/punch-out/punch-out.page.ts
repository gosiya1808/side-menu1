import { Component, OnInit } from '@angular/core';
import { Attendance } from 'src/app/Model/employee-details';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiServicesService } from 'src/app/Services/api-services.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';




@Component({
  selector: 'app-punch-out',
  templateUrl: './punch-out.page.html',
  styleUrls: ['./punch-out.page.scss'],
})
export class PunchOutPage implements OnInit {
  dummy = new Attendance();
  dataJson:string|any;
  AttendanceId:any;
 
 
  
  constructor(
    private api:ApiServicesService,
    public modalCtrl: ModalController,
    private router:Router,
    private geolocation: Geolocation,
    private route: ActivatedRoute,
    private toastController: ToastController
  ) {
    //this.getCurrentCoordinates();
  
    
  }
  // onSubmit() {
  //   //this.details.EndingTime = new Date().toLocaleTimeString();
  //    this.api.updateAttedance(this.dummy)
  //      .then(async response => {
  //        console.log('updated successfully:', response);
  //         this.dataJson = JSON.parse(response.data);
  //         console.log(this.dataJson);
  //         this.dummy = this.dataJson['Result'];   
  //         console.log(this.dummy);
  //         const toast = await this.toastController.create({
  //           message: 'You have attendance successfully!',
  //           duration: 2000, 
  //           position: 'bottom' 
  //         });
  //         toast.present(); 
  //         toast.onDidDismiss().then(() => {
  //           this.navigate();
  //         });
  //      })
  //      .catch(error => {
  //        console.error('Error updating data:', error);
  //      });
  //  }
 

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
      this.dummy.OutLatitude = resp.coords.latitude;
      this.dummy.OutLongitude = resp.coords.longitude;
      this.api.hideLoader();
     }).catch((error) => {
       console.log('Error getting location', error);
   });
  }

  ngOnInit() {
  }

}
