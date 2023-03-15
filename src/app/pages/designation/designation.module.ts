import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DesignationPageRoutingModule } from './designation-routing.module';

import { DesignationPage } from './designation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DesignationPageRoutingModule
  ],
  declarations: [DesignationPage]
})
export class DesignationPageModule {}
