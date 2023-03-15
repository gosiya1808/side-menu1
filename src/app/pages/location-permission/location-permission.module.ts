import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocationPermissionPageRoutingModule } from './location-permission-routing.module';

import { LocationPermissionPage } from './location-permission.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocationPermissionPageRoutingModule
  ],
  declarations: [LocationPermissionPage]
})
export class LocationPermissionPageModule {}
