import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/Model/employee-details';
import { HTTP } from '@ionic-native/http/ngx';
import { ApiServicesService } from 'src/app/Services/api-services.service';
import { Platform } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';




@Component({
  selector: 'app-employee-enrollment',
  templateUrl: './employee-enrollment.page.html',
  styleUrls: ['./employee-enrollment.page.scss'],
})
export class EmployeeEnrollmentPage implements OnInit {

  employeeList: Employee[] = [];
  employeeListJson: string | any;
  PageNumber = 1;
  EmployeeId: number | any;


  constructor(
    private api: ApiServicesService,
    private http: HTTP,
    private plt: Platform,
    private loadingController: LoadingController,
    private router: Router
  ) {

  }
  ngOnInit() {
    this.showData();
  }
  showData() {
    this.plt.ready().then((readySource: any) => {
      console.log('Platform ready from', readySource);
      this.api.showLoader()
      this.api.getEmployess(this.PageNumber).subscribe((res: any) => {
        console.log(res)
        this.employeeListJson = JSON.parse(res);
        console.log(this.employeeListJson);
        this.employeeList = this.employeeListJson['Result'];
        console.log(this.employeeList);
        this.api.hideLoader();
        this.PageNumber++;
      })
    });
  }

  onNavigate(EmployeeId: number) {
    this.router.navigate(['employee-details'],
      {
        queryParams: {
          id: EmployeeId
        }
      });
  }

}
