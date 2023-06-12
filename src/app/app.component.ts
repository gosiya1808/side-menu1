import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Platform, NavController } from '@ionic/angular';
import { ApiServicesService } from 'src/app/Services/api-services.service';
import { NavigationEnd, Router } from '@angular/router';
import { UserAuth } from 'src/app/Model/employee-details';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  

  constructor(
    public plt: Platform,
    public api:ApiServicesService,
    private router:Router ) {
      
    }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  
  // checkLocationPermission(){
  //   this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
  //     result => {
  //       if (result.hasPermission) {


  //         this.locationAccuracy.canRequest().then((canRequest: boolean) => {
  //           if (canRequest) {

  //             this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
  //               () => {

  //               },
  //               error => console.log('Error requesting location accuracy: ' + JSON.stringify(error))
  //             );
  //           }
  //         });
  //       } else {

  //         this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
  //           () => {

  //             this.locationAccuracy.canRequest().then((canRequest: boolean) => {
  //               if (canRequest) {
  //                 this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
  //                   () => {

  //                   },
  //                   error => console.log('Error requesting location accuracy: ' + JSON.stringify(error))
  //                 );
  //               }
  //             });
  //           },
  //           error => console.log('Error requesting location permission: ' + JSON.stringify(error))
  //         );
  //       }
  //     },
  //     error => console.log('Error checking location permission: ' + JSON.stringify(error))
  //   );
  // }


}
