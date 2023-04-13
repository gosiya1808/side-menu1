import { Component, OnInit } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import  { Diagnostic } from '@ionic-native/diagnostic/ngx'
import { Router } from '@angular/router';

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Component({
  selector: 'app-location-permission',
  templateUrl: './location-permission.page.html',
  styleUrls: ['./location-permission.page.scss'],
})
export class LocationPermissionPage implements OnInit {

  constructor(
    private navCtrl:  NavController,
    private alertController: AlertController,
    private diagnostic: Diagnostic,
    private router : Router,
    private  plt : Platform,
    private  alertCtrl : AlertController,
     private androidPermissions: AndroidPermissions

  ) { }


    ngOnInit() {
      this.plt.ready().then(()=>{
        console.log('running1');
        this.route();
      })
    }

    loc: boolean = false;


  //Condition for Routing to direct LOGIN PAGE if both permission  & location are enabled
   async route(){
      if( (this.diagnostic.permissionStatus.GRANTED || this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE) && await this.diagnostic.isLocationEnabled() === true ){
        this.router.navigate(['login'],{ replaceUrl: true });
        console.log('Routered')
      }

    }


    //Function For checking Permission & routing
    checkPermission(){
      this.diagnostic.requestLocationAuthorization().then(async (status) => {
        console.log(status);
        //this switch case check the permissions
        switch (status) {

           case this.diagnostic.permissionStatus.NOT_REQUESTED && await this.diagnostic.isLocationEnabled() === true:
             console.log('Location permission has not been requested yet');
             this.diagnostic.switchToSettings();
             this.router.navigate(['location-permission']);
           break;

           case this.diagnostic.permissionStatus.DENIED_ALWAYS :
            console.log('Denied IN')
              const alert1 = this.alertCtrl.create({
                  header: 'Location Permission',
                  message: 'Please go to your app settings to enable location permission.',
                  buttons: [{
                  text: 'Cancel',
                  role: 'cancel'
                 }, {
                      text: 'Open Settings',
                      handler: () => {
                         this.diagnostic.switchToSettings();
                     }
                  }]
               });
              (await alert1).present();
              this.checkLocaction();
           break;

           case this.diagnostic.permissionStatus.DENIED_ONCE:
               console.log('Location permission has been denied ONCE');
               const alert = this.alertCtrl.create({
                    header: 'Location Permission',
                    message: 'Please go to your app settings to enable location permission.',
                    buttons: [{
                                text: 'Cancel',
                                role: 'cancel'
                             }, {
                                text: 'Open Settings',
                                handler: () => {
                                this.diagnostic.switchToSettings();
                               }
                             }]
                            });
                          (await alert).present();
                          this.checkLocaction();
            break;

            case this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE :
                console.log('Location permission has been granted only when the app is in use');
                this.checkLocaction();
                if(this.loc){
                  this.router.navigate(['login'],{ replaceUrl: true })
                }
            break;

         }

       }).catch((error) => {
         console.error(error);
       });
     }

     //Alert message for asking location  permission
     async alertMsg(){
      console.log('showLocationSettingsAlert() called');
      const alert = await this.alertController.create({
        header: 'Location permission required',
        message: 'Please enable location access in app settings to use this feature',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Go To Setting',
            handler: () => {
              this.diagnostic.switchToSettings();
            }
          }
        ]
      });
      await alert.present();
    }

    //Function will check if location is enable or not & ask for location permission
    async checkLocaction(){
      this.diagnostic.isLocationEnabled().then(async (isEnabled) => {
        if (isEnabled) {
          this.loc = true;
          console.log('Location services are enabled');
        } else {
          console.log('Location services are disabled');
          let alert = this.alertCtrl.create({
            header: 'Location Services Disabled',
            message: 'Please enable location services to use this feature.',
            buttons: [{
              text: 'Cancel',
              role: 'cancel'
            }, {
              text: 'Enable',
              handler: () => {
                this.diagnostic.switchToLocationSettings();
              }
            }]
          });
          (await alert).present();
        }
      }).catch((error) => {
        console.log('Error checking location status', error);
      });
    }
}
