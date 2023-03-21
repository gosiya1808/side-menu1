import { Component, OnInit } from '@angular/core';
import { Attendance } from 'src/app/Model/employee-details';
import { HTTP } from '@ionic-native/http/ngx';
import { ApiServicesService } from 'src/app/Services/api-services.service';
import { Platform } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.page.html',
  styleUrls: ['./attendance.page.scss'],
})
export class AttendancePage implements OnInit {

  page=1;
  EmployeeId: number |any;
  detailsJson:string|any;
  employees:Attendance |any;
  //abc='D:/side-menu/src/assets/images/back.svg';

  constructor(
    private api: ApiServicesService,
    private http:HTTP,
    private plt:Platform,
    private loadingController: LoadingController,
    private route: ActivatedRoute
  ) { }


  

  async ngOnInit() {
    // this.EmployeeId=this.route.snapshot.queryParams['id'];
    // console.log(this.EmployeeId)
    // await this.api.getEmployessById(this.EmployeeId).then((res:any)=>{
    //   console.log(res);
    //   try {
    //     this.detailsJson = JSON.parse(res.data);
    //     console.log(this.detailsJson);
    //     this.employees = this.detailsJson['Result'];   
    //     console.log(this.employees);
    //   }catch (error) {
    //     console.error('Error parsing JSON:', error);
    //   }
    // })
  }

}
