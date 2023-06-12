import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HrDashboardPage } from './hr-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: HrDashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HrDashboardPageRoutingModule {}
