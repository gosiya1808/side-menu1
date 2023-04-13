import { Component, } from '@angular/core';
import { ApiServicesService } from 'src/app/Services/api-services.service';
import { Attendance, Employee } from '../Model/employee-details';
import { Chart } from 'chart.js';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage{
  attendance: Attendance | any;
  punchInTime!: Date;
  punchOutTime!: Date;
  progressPercentage: number = 0;
  totalTime: number = 60; // total time in seconds
  intervalId: any; 
  strokeDashArray: string = '0, 439.8223650461362';


  constructor(private api: ApiServicesService) {}

  // startTimer() {
  //   // Reset progress percentage
  //   this.progressPercentage = 0;

  //   // Calculate stroke dash array value based on total time
  //   this.strokeDashArray = `0, ${2 * Math.PI * 70}`;

  //   // Start interval to update progress percentage
  //   const intervalId = setInterval(() => {
  //     this.progressPercentage = Math.floor((this.progressPercentage + 1) * 100 / this.totalTime); // calculate progress percentage based on time elapsed
  //     if (this.progressPercentage >= 100) {
  //       // Stop the timer when progress reaches 100%
  //       clearInterval(intervalId);
  //     }
  //   }, 1000); // update progress every 1 second
  // }
  
  // updateProgress() {
  //   const now = new Date();
  //   const totalDuration = this.punchOutTime.getTime() - this.punchInTime.getTime();
  //   const elapsedDuration = now.getTime() - this.punchInTime.getTime();
  //   this.progressPercentage = (elapsedDuration / totalDuration) * 100;
  //   console.log(this.progressPercentage);
  // }
  ngOnInit() {
  //   this.attendance = {
  //     AttendanceId: 1,
  //     EmployeeId: 1,
  //     Date: '2023-04-10',
  //     InTime: '09:00:00',
  //     OutTime: '17:00:00',
  //   };
  //   this.punchInTime = new Date('2023-04-10T09:00:00');
  //   this.punchOutTime = new Date('2023-04-10T17:00:00');
  //   // this.attendance = Attendance;
  //   this.updateProgress();
  //   this.startTimer();
  }
}
