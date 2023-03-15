import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeeEnrollmentPage } from './employee-enrollment.page';

const routes: Routes = [
  {
    path: '',
    component: EmployeeEnrollmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeEnrollmentPageRoutingModule {}
