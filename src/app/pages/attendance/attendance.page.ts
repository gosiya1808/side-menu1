import { Component, OnInit } from '@angular/core';
import { Attendance } from 'src/app/Model/employee-details';
import { HTTP } from '@ionic-native/http/ngx';
import { ApiServicesService } from 'src/app/Services/api-services.service';
import { Platform } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';


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
  details:Attendance |any;
  formattedTime: string | any;
  
  //abc='D:/side-menu/src/assets/images/back.svg';

  constructor(
    private api: ApiServicesService,
    private http:HTTP,
    private plt:Platform,
    private loadingController: LoadingController,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) { }

  async ngOnInit() {
    const EmployeeId = 1;
    console.log(EmployeeId)
    await this.api.getAttendanceById(EmployeeId).then((res:any)=>{
      console.log(res);
      try {
        this.detailsJson = JSON.parse(res.data);
        console.log(this.detailsJson);
        this.details = this.detailsJson['Result'];   
        console.log(this.details);
        console.log(this.details.InTime);
        console.log(this.details.OutTime);
        const inTimeParts = this.details.InTime.split(/[:.]/);
        const outTimeParts = this.details.OutTime.split(/[:.]/);
        const dateParts = this.details.Date.slice(0, 10).split('-');
        this.details = {
          year: dateParts[0],
          month: dateParts[1],
          day: dateParts[2],
          InHours: inTimeParts[0],
          InMinutes: inTimeParts[1],
          InSeconds: inTimeParts[2],
          OutHours: outTimeParts[0],
          OutMinutes: outTimeParts[1],
          OutSeconds: outTimeParts[2]
        };

         //varaible change kiya hai and ye three lines last wali 
         const timeString = `${this.details.InHours}:${this.details.InMinutes}:${this.details.InSeconds}`;
         this.formattedTime = this.datePipe.transform(timeString, 'hh:mm:ss a');
        // this.detailsJson.InTime = moment(res.InTime, 'hh:mm a').format('HH:mm:ss');
        // console.log('details.InTime:', this.detailsJson.InTime);
        // this.detailsJson.OutTime = moment(res.OutTime, 'hh:mm a').format('HH:mm:ss');

        // this.detailsJson.InTime =res.InTime;
        // console.log('details.InTime:', this.detailsJson.InTime);
        // this.detailsJson.OutTime = this.datePipe.transform(this.details.OutTime, 'HH:mm:ss');
        // console.log('details.OutTime:', this.detailsJson.OutTime);
        // this.detailsJson.InTime = res.InTime ? this.datePipe.transform(res.InTime, 'HH:mm:ss') : '';
        // console.log('details.InTime:', this.detailsJson.InTime);
        // this.detailsJson.OutTime = res.OutTime ? this.datePipe.transform(res.OutTime, 'HH:mm:ss') : '';
        // console.log('details.OutTime:', this.detailsJson.OutTime);
      }catch (error) {
        console.error('Error parsing JSON:', error);
      }
    })
  }
  

}
