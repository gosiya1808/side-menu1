import { Component, OnInit } from '@angular/core';
import { Attendance } from 'src/app/Model/employee-details';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiServicesService } from 'src/app/Services/api-services.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-punch-out',
  templateUrl: './punch-out.page.html',
  styleUrls: ['./punch-out.page.scss'],
})
export class PunchOutPage implements OnInit {
  details = new Attendance();
  detailsJson:string|any;
  AttendanceId:any;
 
  
  constructor(
    private api:ApiServicesService,
    public modalCtrl: ModalController,
    private router:Router,
    private geolocation: Geolocation,
    private route: ActivatedRoute,
  ) {this.getCurrentCoordinates();
  
    
  }
  onSubmit() {
    //this.details.EndingTime = new Date().toLocaleTimeString();
     this.api.updateAttedance(this.details)
       .then(response => {
         console.log('updated successfully:', response);
       })
       .catch(error => {
         console.error('Error updating data:', error);
       });
    // }) 
   }
 

  //  navigate(){
  //   this.router.navigate(['attendance'])
  // }
  async dismiss() {
    return await this.modalCtrl.dismiss();
  }
  getCurrentCoordinates() {
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp)
      this.details.OutLatitude = resp.coords.latitude;
      this.details.OutLongitude = resp.coords.longitude
     }).catch((error) => {
       console.log('Error getting location', error);
   });
  }

  ngOnInit() {
  }

}
