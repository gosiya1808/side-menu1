import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MenuPage } from './pages/menu/menu.page';

const routes: Routes = [
  {
    path: 'menu',
    component: MenuPage,
    children:[
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
      },
   
      
      {
        path: 'employee-enrollment',
        loadChildren: () => import('./pages/employee-enrollment/employee-enrollment.module').then( m => m.EmployeeEnrollmentPageModule)
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
      {
        path: 'profile',
        loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: 'salary',
        loadChildren: () => import('./pages/salary/salary.module').then( m => m.SalaryPageModule)
      },
      {
        path: 'forget-password',
        loadChildren: () => import('./pages/forget-password/forget-password.module').then( m => m.ForgetPasswordPageModule)
      },
      {
        path: 'hr-dashboard',
        loadChildren: () => import('./pages/hr-dashboard/hr-dashboard.module').then( m => m.HrDashboardPageModule)
      },
      
    ],
  },   
  // {
  //   path: '',
  //   redirectTo: 'location-permission',
  //   pathMatch: 'full'
  // },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./pages/menu/menu.module').then( m => m.MenuPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
