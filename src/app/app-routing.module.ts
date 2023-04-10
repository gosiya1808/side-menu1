import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'location-permission',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'employee-enrollment',
    loadChildren: () => import('./pages/employee-enrollment/employee-enrollment.module').then( m => m.EmployeeEnrollmentPageModule)
  },
  {
    path: 'department',
    loadChildren: () => import('./pages/department/department.module').then( m => m.DepartmentPageModule)
  },
  {
    path: 'designation',
    loadChildren: () => import('./pages/designation/designation.module').then( m => m.DesignationPageModule)
  },
  {
    path: 'attendance',
    loadChildren: () => import('./pages/attendance/attendance.module').then( m => m.AttendancePageModule)
  },
  {
    path: 'add-attendance',
    loadChildren: () => import('./pages/add-attendance/add-attendance.module').then( m => m.AddAttendancePageModule)
  },
  {
    path: 'location-permission',
    loadChildren: () => import('./pages/location-permission/location-permission.module').then( m => m.LocationPermissionPageModule)
  },
  {
    path: 'punch-out',
    loadChildren: () => import('./pages/punch-out/punch-out.module').then( m => m.PunchOutPageModule)
  },
  {
    path: 'employee-details',
    loadChildren: () => import('./pages/employee-details/employee-details.module').then( m => m.EmployeeDetailsPageModule)
  },
  {
    path: 'calendar',
    loadChildren: () => import('./pages/calendar/calendar.module').then( m => m.CalendarPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
