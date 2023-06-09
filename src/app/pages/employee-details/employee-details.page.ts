import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Employee } from 'src/app/Model/employee-details';

import { ApiServicesService } from 'src/app/Services/api-services.service';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.page.html',
  styleUrls: ['./employee-details.page.scss'],
})
export class EmployeeDetailsPage implements OnInit {

  EmployeeId: number | any;
  detailsJson: string | any;
  employees: Employee | any;
  birthdate = new Date().toISOString().slice(0, 10);
  bday:string|any;

  constructor(private api: ApiServicesService, private route: ActivatedRoute,) {

  }

  async ionViewDidEnter() {
    await this.employeeDetails();
  }

  employeeDetails() {
    this.EmployeeId = this.route.snapshot.queryParams['id'];
    console.log(this.EmployeeId);
    this.api.showLoader();
    this.api.getEmployessById(this.EmployeeId).then((res: any) => {
      console.log(res);
      try {
        this.detailsJson = JSON.parse(res.data);
        console.log(this.detailsJson);
        this.employees = this.detailsJson['Result'];
        console.log(this.employees);
        this.bday = this.birthdate+'T'+this.employees.BirthDate+'Z' 
        console.log(this.bday);
        this.api.hideLoader();
        // const dateParts = this.employees.BirthDate.slice(0, 10).split('-');
        // this.employees = {
        //   year: dateParts[0],
        //   month: dateParts[1],
        //  day: dateParts[2],
        // }
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    })
  }

  ngOnInit() {

  }

}
