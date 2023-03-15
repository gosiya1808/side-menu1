import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import  { Diagnostic } from '@ionic-native/diagnostic/ngx'


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
  ) { }

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

  ngOnInit() {
  }

}
