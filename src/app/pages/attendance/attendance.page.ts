import { Component, OnInit } from '@angular/core';
import { Attendance } from 'src/app/Model/employee-details';
import { HTTP } from '@ionic-native/http/ngx';
import { ApiServicesService } from 'src/app/Services/api-services.service';
import { Platform } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';




@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.page.html',
  styleUrls: ['./attendance.page.scss'],
  providers: [DatePipe]
})
export class AttendancePage implements OnInit {

  page=1;
  EmployeeId: number |any;
  detailsJson:string|any;
  details: Attendance |any;
  data:Attendance|any;
  punchIntime!:string;
  punchOutTime!:string;

  dateFromApi!: string;
  dummy='2023-04-03T11:29:23.051Z';
  
  //abc='D:/side-menu/src/assets/images/back.svg';

  constructor(
    private api: ApiServicesService,
    private http:HTTP,
    private plt:Platform,
    private loadingController: LoadingController,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) { }

  
  async ionViewDidEnter() {
    await this.attendance();
  }


  ngOnInit() {
    
  }

  attendance() {
    const EmployeeId = 5;
    console.log(EmployeeId)
    const today = new Date().toISOString().slice(0, 10);
    this.api.showLoader();
    this.api.getAttendanceById(EmployeeId,today).then((res:any)=>{
      console.log(res);
        this.detailsJson = JSON.parse(res.data);
        console.log(this.detailsJson);
        this.details = this.detailsJson['Result'];   
        this.punchIntime = today+'T'+this.details.InTime+'Z'
        console.log(this.punchIntime)
        this.punchOutTime = today+'T'+this.details.OutTime+'Z'
        console.log(this.punchOutTime)
        console.log(this.details);
        this.api.hideLoader();
        //ye uncomment karna hai nahi aaya to dsadwdwxcxdssfdsfzczxczxc
          console.log(this.details.InTime);
          console.log(this.details.OutTime);
          // const inTimeParts = this.details.InTime.split(/[:.]/);
          // const outTimeParts = this.details.OutTime.split(/[:.]/);
          //const dateParts = this.details.Date.slice(0, 10).split('-');

          // this.data = {
          //   year: dateParts[0],
          //   month: dateParts[1],
          //   day: dateParts[2],
          //   // InHours: inTimeParts[0],
          //   // InMinutes: inTimeParts[1],
          //   // InSeconds: inTimeParts[2],
          //   // OutHours: outTimeParts[0],
          //   // OutMinutes: outTimeParts[1],
          //   // OutSeconds: outTimeParts[2],
          // };
          for (let i = 0; i < this.details.length; i++) {
            // Check if the attendance has punch-in time but no punch-out time
            if (this.details[i]['punchIntime'] !== null && this.details[i]['punchOutTime'] === null) {
              // Display the punch-in time and leave the punch-out time blank
              console.log('Punch In: ' + this.details['punchIntime']);
              console.log('Punch Out: ',"");
            }
          }

    }).catch(error=>{
      console.log("error getting data",error);
    })
  }
  

}
