import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DesignationPage } from './designation.page';

const routes: Routes = [
  {
    path: '',
    component: DesignationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesignationPageRoutingModule {}
