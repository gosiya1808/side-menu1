import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationPermissionPage } from './location-permission.page';

const routes: Routes = [
  {
    path: '',
    component: LocationPermissionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationPermissionPageRoutingModule {}
