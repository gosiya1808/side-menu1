import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Platform, NavController } from '@ionic/angular';
import  { Diagnostic } from '@ionic-native/diagnostic/ngx'
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private diagnostic: Diagnostic,
    private alertController: AlertController,
    private navCtrl:  NavController,
    public plt: Platform,
    private androidPermissions: AndroidPermissions
  ) {this.initializeApp();}

  ionViewWillEnter(){
    this.requestLocationPermission();
  }
  

  async showLocationSettingsAlert() {
    console.log('showLocationSettingsAlert() called');
      const alert = await this.alertController.create({
        header: 'Location permission required',
        message: 'Please enable location access in app settings to use this feature',
        buttons: [
          {
            text: 'Cancel',
            role : 'cancel'
          },
          {
            text: 'Retry',
            handler: () => {
                this.diagnostic.isLocationAuthorized().then((authorized) => {
                  if (authorized === false) {
                    this.Permission();
                  }
                }).catch((error) => {
                  console.log('Error checking location authorization', error);
                });
            }
          }
        ]
      });
      await alert.present();
     }
     async alert() {
      console.log('alert() called');
        const alert = await this.alertController.create({
          header: 'Location permission required',
          message: 'Please enable location access in app settings to use this feature',
          buttons: [
            {
              text: 'Cancel',
              role : 'cancel'
            },
          ]
        });
        await alert.present();
       }
  requestLocationPermission() {
    this.diagnostic.requestLocationAuthorization().then((status) => {
      if (status === this.diagnostic.permissionStatus.DENIED) {
        this.showLocationSettingsAlert();
      } else if (status === this.diagnostic.permissionStatus.NOT_REQUESTED) {
        // The user did not respond to the permission request
      } else if (status === this.diagnostic.permissionStatus.DENIED_ALWAYS) {
        // The user denied the permission permanently
        this.showLocationSettingsAlert();
      }
    }).catch((error) => {
      console.log('Error requesting location authorization', error);
    });
  }
  Permission() {
    this.diagnostic.requestLocationAuthorization().then((status) => {
      if (status === this.diagnostic.permissionStatus.DENIED) {
        this.alert();
      } else if (status === this.diagnostic.permissionStatus.NOT_REQUESTED) {
        // The user did not respond to the permission request
      } else if (status === this.diagnostic.permissionStatus.DENIED_ALWAYS) {
        // The user denied the permission permanently
        this.alert();
      }
    }).catch((error) => {
      console.log('Error requesting location authorization', error);
    });
  }

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
  

  initializeApp() {
    this.plt.ready().then(() => {
      this.diagnostic.isLocationAuthorized().then((authorized) => {
        if (authorized === false) {
          this.requestLocationPermission();
        }
      }).catch((error) => {
        console.log('Error checking location authorization', error);
      });
    });
  }
  
  ngOnInit() {
    
  }
}
