import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Platform, NavController } from '@ionic/angular';
import  { Diagnostic } from '@ionic-native/diagnostic/ngx'
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation} from '@ionic-native/geolocation/ngx';
import { LocationService } from './Services/location.service';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { MenuController } from '@ionic/angular';

import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private diagnostic: Diagnostic,
    private alertCtrl: AlertController,
    private navCtrl:  NavController,
    public plt: Platform,
    private locationAccuracy:LocationAccuracy,
    private androidPermissions: AndroidPermissions,
    private geolocation: Geolocation,
    private menuController: MenuController,
  ) {
   // this.initializeApp();
  }

  ngOnInit() {
      this.plt.ready().then(()=>{
        console.log('running App');
        this.checkLocationPermission();
      })
  }

  // ionViewWillEnter(){
  // //  this.requestLocationPermission();
  // }


  checkLocationPermission(){
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        if (result.hasPermission) {


          this.locationAccuracy.canRequest().then((canRequest: boolean) => {
            if (canRequest) {

              this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                () => {

                },
                error => console.log('Error requesting location accuracy: ' + JSON.stringify(error))
              );
            }
          });
        } else {

          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
            () => {

              this.locationAccuracy.canRequest().then((canRequest: boolean) => {
                if (canRequest) {
                  this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                    () => {

                    },
                    error => console.log('Error requesting location accuracy: ' + JSON.stringify(error))
                  );
                }
              });
            },
            error => console.log('Error requesting location permission: ' + JSON.stringify(error))
          );
        }
      },
      error => console.log('Error checking location permission: ' + JSON.stringify(error))
    );
  }



  // checkPermission(){

  //   this.diagnostic.requestLocationAuthorization().then(async (status) => {
  //      console.log(status);
  //       switch (status) {
  //        case this.diagnostic.permissionStatus.NOT_REQUESTED :
  //          console.log('Location permission has not been requested yet');
  //           this.diagnostic.isLocationEnabled();
  //          this.router.navigate(['location-permission']);
  //          break;
  //        case this.diagnostic.permissionStatus.DENIED_ALWAYS  :
  //         const alert = this.alertCtrl.create({
  //           header: 'Location Permission',
  //           message: 'Please go to your app settings to enable location permission.',
  //           buttons: [{
  //             text: 'Cancel',
  //             role: 'cancel'
  //           }, {
  //             text: 'Open Settings',
  //             handler: () => {
  //               this.diagnostic.switchToSettings();
  //             }
  //           }]
  //         });
  //           (await alert).present();
  //           this.diagnostic.isLocationEnabled();
  //          break;
  //        case this.diagnostic.permissionStatus.GRANTED  && await this.diagnostic.isLocationEnabled():
  //          console.log('Location permission has been granted');
  //          this.diagnostic.isLocationEnabled();
  //          this.router.navigate(['login']);
  //          break;
  //        case this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE :
  //          console.log('Location permission has been granted only when the app is in use');
  //          this.diagnostic.isLocationEnabled().then(()=>{
  //             this.router.navigate(['login']);
  //          });

  //          break;
  //          case this.diagnostic.permissionStatus.DENIED_ONCE :
  //           this.diagnostic.requestLocationAuthorization();

  //      }
  //      this.diagnostic.isLocationEnabled().then((ok)=>{

  //      })
  //    }).catch((error) => {
  //      console.error(error);
  //    });
  //  }

  //  checkStatus(){
  //   this.diagnostic.requestLocationAuthorization().then(()=>{
  //     this.diagnostic.permissionStatus.DENIED_ALWAYS ;
  //            console.log('checked Status');
  //             this.diagnostic.switchToSettings();
  //             this.router.navigate(['location-permission']);
  //   })
  // }

  //  async alertMsg(){
  //   console.log('showLocationSettingsAlert() called');
  //   const alert = await this.alertController.create({
  //     header: 'Location permission required',
  //     message: 'Please enable location access in app settings to use this feature',
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel'
  //       },
  //       {
  //         text: 'Go To Setting',
  //         handler: () => {
  //           this.diagnostic.switchToSettings();
  //         }
  //       }
  //     ]
  //   });
  //   await alert.present();
  // }




   //--------------------------------------------------Gosiya Code fsdgvddfsfdsfdfdsfffgdf
  // async showLocationSettingsAlert() {
  //   console.log('showLocationSettingsAlert() called');
  //     const alert = await this.alertController.create({
  //       header: 'Location permission required',
  //       message: 'Please enable location access in app settings to use this feature',
  //       buttons: [
  //         {
  //           text: 'Cancel',
  //           role : 'cancel'
  //         },
  //         {
  //           text: 'Retry',
  //           handler: () => {
  //               this.diagnostic.isLocationAuthorized().then((authorized) => {
  //                 if (authorized === false) {
  //                   this.Permission();
  //                 }
  //               }).catch((error) => {
  //                 console.log('Error checking location authorization', error);
  //               });
  //           }
  //         }
  //       ]
  //     });
  //     await alert.present();
  //    }


    //  async alert() {
    //   console.log('alert() called');
    //     const alert = await this.alertController.create({
    //       header: 'Location permission required',
    //       message: 'Please enable location access in app settings to use this feature',
    //       buttons: [
    //         {
    //           text: 'Cancel',
    //           role : 'cancel'
    //         },
    //       ]
    //     });
    //     await alert.present();
    //    }

  // requestLocationPermission() {
  //   this.diagnostic.requestLocationAuthorization().then((status) => {
  //     if (status === this.diagnostic.permissionStatus.DENIED) {
  //       this.showLocationSettingsAlert();
  //     } else if (status === this.diagnostic.permissionStatus.NOT_REQUESTED) {
  //       // The user did not respond to the permission request
  //     } else if (status === this.diagnostic.permissionStatus.DENIED_ALWAYS) {
  //       // The user denied the permission permanently
  //       this.showLocationSettingsAlert();
  //     }
  //   }).catch((error) => {
  //     console.log('Error requesting location authorization', error);
  //   });
  // }
  // Permission() {
  //   this.diagnostic.requestLocationAuthorization().then((status) => {
  //     if (status === this.diagnostic.permissionStatus.DENIED) {
  //       this.alert();
  //     } else if (status === this.diagnostic.permissionStatus.NOT_REQUESTED) {
  //       // The user did not respond to the permission request
  //     } else if (status === this.diagnostic.permissionStatus.DENIED_ALWAYS) {
  //       // The user denied the permission permanently
  //       this.alert();
  //     }
  //   }).catch((error) => {
  //     console.log('Error requesting location authorization', error);
  //   });
  // }

  // androidPermission(){
  //   this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
  //     resolve => {
  //       if(resolve.hasPermission)
  //       {
  //         console.log('Permission granted');
  //       }else{
  //         console.log('Permission denied');
  //       }
  //     }
  //   )

  // }


  //initializeApp() {
    // this.plt.ready().then(() => {
    //   this.diagnostic.isLocationAuthorized().then((authorized) => {
    //     if (authorized === false) {
    //       this.requestLocationPermission();
    //     }
    //   }).catch((error) => {
    //     console.log('Error checking location authorization', error);
    //   });
    // });
  //}

  // async showRetryAlert() {
  //   const alert = await this.alertController.create({
  //     header: 'Location Permission',
  //     message: 'Please enable location access to use this app.',
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         handler: () => {
  //           console.log('Permission denied');
  //         }
  //       },
  //       {
  //         text: 'Retry',
  //         handler: () => {
  //           console.log('Retrying location permission');
  //           this.geolocation.getCurrentPosition().then((resp) => {
  //             console.log(resp);
  //               this.checkLocationEnabled();
  //           }).catch((error) => {
  //             console.log('Error getting location', error);
  //           });
  //         }
  //       }
  //     ]
  //   });
  //   await alert.present();
  // }
  // checkLocationEnabled() {
  //   this.diagnostic.isLocationEnabled().then((enabled) => {
  //     if (enabled) {
  //       this.geolocation.getCurrentPosition().then((resp) => {
  //         console.log(resp);
  //       }).catch((error) => {
  //         console.log('Error getting location', error);
  //       });
  //     } else {
  //       this.showLocationServicesAlert();
  //     }
  //   }).catch((error) => {
  //     console.log('Error checking location', error);
  //   });
  // }


}
