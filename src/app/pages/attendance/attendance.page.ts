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
    const EmployeeId = 8;
    console.log(EmployeeId)
    const today = new Date().toISOString().slice(0, 10);
    await this.api.getAttendanceById(EmployeeId,today).then((res:any)=>{
      console.log(res);
      try {
        this.detailsJson = JSON.parse(res.data);
        console.log(this.detailsJson);
        this.details = this.detailsJson['Result'];   
        console.log(this.details);
        //ye uncomment karna hai nahi aaya to 
          console.log(this.details.InTime);
          console.log(this.details.OutTime);
          // const inTimeParts = this.details.InTime.split(/[:.]/);
          // const outTimeParts = this.details.OutTime.split(/[:.]/);
          const dateParts = this.details.Date.slice(0, 10).split('-');

          this.data = {
            year: dateParts[0],
            month: dateParts[1],
            day: dateParts[2],
            // InHours: inTimeParts[0],
            // InMinutes: inTimeParts[1],
            // InSeconds: inTimeParts[2],
            // OutHours: outTimeParts[0],
            // OutMinutes: outTimeParts[1],
            // OutSeconds: outTimeParts[2],
          };
          for (let i = 0; i < this.details.length; i++) {
            // Check if the attendance has punch-in time but no punch-out time
            if (this.details[i]['InTime'] !== null && this.details[i]['OutTime'] === null) {
              // Display the punch-in time and leave the punch-out time blank
              console.log('Punch In: ' + this.details['InTime']);
              console.log('Punch Out: ',"");
            }
          }

         //varaible change kiya hai and ye three lines last wali 

        //  this.details.Date = this.datePipe.transform(res.Date, 'yyyy-MM-dd') ?? '';
        //  console.log(this.details.Date);
        //  this.details.InTime = this.datePipe.transform(res.InTime, 'hh:mm a') ?? '';
        //  console.log(this.details.InTime);
        //  this.details.OutTime = this.datePipe.transform(res.OutTime, 'hh:mm a') ?? '';
        //  console.log(this.details.OutTime);

         //  const datePipe = new DatePipe('en-US');
        //  const timeString = `${this.details.InHours}:${this.details.InMinutes}:${this.details.InSeconds}`;
        //  this.formattedTime = datePipe.transform(timeString, 'hh:mm:ss a');
        //  console.log(this.formattedTime);
        // this.detailsJson.InTime = moment(res.InTime, 'hh:mm a').format('HH:mm:ss');
        // console.log('details.InTime:', this.detailsJson.InTime);
        // this.detailsJson.OutTime = moment(res.OutTime, 'hh:mm a').format('HH:mm:ss');

      }catch (error) {
        console.error('Error parsing JSON:', error);
      }
    })
  }
  

}
