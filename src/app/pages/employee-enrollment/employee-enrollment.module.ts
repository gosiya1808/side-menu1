import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeeEnrollmentPageRoutingModule } from './employee-enrollment-routing.module';

import { EmployeeEnrollmentPage } from './employee-enrollment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmployeeEnrollmentPageRoutingModule
  ],
  declarations: [EmployeeEnrollmentPage]
})
export class EmployeeEnrollmentPageModule {}
