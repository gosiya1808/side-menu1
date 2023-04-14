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





}
