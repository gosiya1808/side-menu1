import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {HTTP} from '@ionic-native/http/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import  { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Storage } from '@ionic/storage-angular';
import { SwiperModule } from 'swiper/angular'; //na work kare to remove karna

import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { NgChartsModule } from 'ng2-charts';
import { CameraPreview } from '@ionic-native/camera-preview/ngx'; // Import CameraPreview module
import { File } from '@ionic-native/file/ngx';





@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,SwiperModule,NgChartsModule],
  providers: [
    Geolocation,
    Diagnostic,
    AndroidPermissions,
    Storage,LocationAccuracy,CameraPreview,File,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    HTTP
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {}
