import { Component, OnInit } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { ApiServicesService } from 'src/app/Services/api-services.service';
import { NavigationEnd, Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  activePageTitle = 'home';
  activeIndex!: number;
  visiable = true;
  HRPages = [
    {
      title: 'Dashboard',
      url: '/menu/hr-dashboard',
      icon: 'house',
      minRole: 'user',
    },
    {
      title: 'Employee-enrollment',
      url: '/menu/employee-enrollment',
      icon: 'person',
      minRole: 'user',
    },
  ];
  EmployeePages = [
    {
      title: 'Dashboard',
      url: '/menu/home',
      icon: 'house',
      minRole: 'user',
    },
    {
      title: 'Add-attendance',
      url: '/menu/add-attendance',
      icon: 'add-circle',
      minRole: 'user',
    },
    {
      title: 'Calendar',
      url: '/menu/calendar',
      icon: 'calendar-day',
      minRole: 'user',

    },
    {
      title: 'Profile',
      url: '/menu/profile',
      icon: 'person',
      minRole: 'user',
    },
  ];

  animationCtrl: any;
  page: any = [];
  selectedpath = '';
  roleID = this.api.getRole();
  // username = this.api.getEmployeeId();
  customAnimation: any;
  role!: string;

  constructor(public plt: Platform,
    public api: ApiServicesService,
    private router: Router,
    private menuController: MenuController) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.selectedpath = event.url;
        this.menuController.close(); 
      }
    });
  }

  async ngOnInit() {
    console.log(this.roleID);
    await this.loadpages();
    const element = document.getElementById('my-element');
    if (element !== null) {
      this.customAnimation = this.animationCtrl
        .create()
        .addElement(element)
        .duration(500)
        .fromTo('transform', 'translateX(-100%)', 'translateX(0)')
        .easing('ease-in-out');
    }
  }

  loadpages() {
    if (this.roleID == '1') {
      this.role = 'HR';
      console.log('working');
      this.page = this.HRPages;
    } else if (this.roleID == '2') {
      this.page = this.EmployeePages;
      this.role = 'Employee';
    }
    console.log(this.page);
  }

  onLogout() {
    console.log('logout');
    this.api.showLoader()
    this.api.logout()
      .then(() => {
        // Remove local data
        console.log('logout');
        // localStorage.removeItem('authToken');
        // Navigate to login page
        this.router.navigate(['/login']); 
        this.api.hideLoader()
      })
      .catch((error) => {
        console.error(error);
    });
  }
}
