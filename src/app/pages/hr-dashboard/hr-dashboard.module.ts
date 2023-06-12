import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HrDashboardPageRoutingModule } from './hr-dashboard-routing.module';

import { HrDashboardPage } from './hr-dashboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HrDashboardPageRoutingModule
  ],
  declarations: [HrDashboardPage]
})
export class HrDashboardPageModule {}
