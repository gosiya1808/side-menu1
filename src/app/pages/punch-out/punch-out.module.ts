import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PunchOutPageRoutingModule } from './punch-out-routing.module';

import { PunchOutPage } from './punch-out.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PunchOutPageRoutingModule
  ],
  declarations: [PunchOutPage]
})
export class PunchOutPageModule {}
