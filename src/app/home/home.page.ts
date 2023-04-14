import {AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ApiServicesService } from 'src/app/Services/api-services.service';
import { Attendance, Employee } from '../Model/employee-details';
import { Chart } from 'chart.js';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  private punchInTime: Date = new Date(2023, 3, 14, 9, 0, 0); // Static punch in time (9:00 AM)
  private punchOutTimee: Date = new Date(2023, 3, 14, 17, 0, 0);
  private remainingTime: string = '';
  doughnutChart: any;

  page = 1;
  EmployeeId: number | any;
  detailsJson: string | any;
  details: Attendance | any;
  data: Attendance | any;
  punchIntime!: string;
  punchOutTime!: string;

  dateFromApi!: string;
  dummy = '2023-04-03T11:29:23.051Z';

  @ViewChild('doughnutCanvas') private doughnutCanvas!: ElementRef;
  @ViewChild('completedTime') public completedTime!: ElementRef;
  
  constructor(private api: ApiServicesService) {}


  async ionViewDidEnter() {
    await this.attendance();
  }
  
  ngAfterViewInit() {
    this.doughnutChartMethod(); 
    this.startDynamicAnimation();
  }
  doughnutChartMethod() {
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Punch-in', 'Current-time'],
        datasets: [{
          label: 'timing',
          data: [0, 0],
          backgroundColor: [
            '#4242A6',
            '#adadde',
          ],
          // hoverBackgroundColor: [
          //   '#FFCE56',
          //   '#FF6384',
          // ]
        }]
      },
      options: {
        cutout:98,
        responsive:true,
        animation: { // Add animation optionsxaxax
          animateRotate: true,
          animateScale: true,
        },
        
      }
    
      
      
    });
  }
  startDynamicAnimation(): void {
    this.doughnutChart.data.datasets[0].data = [0, 0];
    this.doughnutChart.update();
    setInterval(() => {
      const now = new Date();
      const elapsed = now.getTime() - this.punchInTime.getTime();
      const totalDuration = this.punchOutTimee.getTime() - this.punchInTime.getTime();
      // const remaining = this.punchOutTimee.getTime() - now.getTime(); 
      
      this.doughnutChart.data.datasets[0].data = [
        elapsed / totalDuration * 100,
        (totalDuration - elapsed) / totalDuration * 100
      ];
      this.doughnutChart.update();
      // const remainingTime = new Date(remaining);fgbhfdh
      // // console.log(remainingTime)
      // const remainingHours = Math.floor(remainingTime.getTime() / (60 * 60 * 1000));
      // const remainingMinutes = Math.floor(remainingTime.getTime() % (60 * 60 * 1000) / (60 * 1000));
      // const completedTime = `${remainingHours} hrs ${remainingMinutes} mins`;
      // console.log(completedTime)
      const elapsedHours = Math.floor(elapsed / (60 * 60 * 1000));
      const elapsedMinutes = Math.floor(elapsed % (60 * 60 * 1000) / (60 * 1000));
      const elapsedTimeString = `${elapsedHours} hrs: ${elapsedMinutes} mins`;
      (<HTMLSpanElement>document.getElementById('remainingTime')).textContent = elapsedTimeString;
      
    }, 1000); 
  }

  attendance() {
    const EmployeeId = 4;
    console.log(EmployeeId)
    const today = new Date().toISOString().slice(0, 10);
    // this.api.showLoader();
    this.api.getAttendanceById(EmployeeId, today).then((res: any) => {
      console.log(res);
      this.detailsJson = JSON.parse(res.data);
      console.log(this.detailsJson);
      this.details = this.detailsJson['Result'];
      this.punchIntime = today + 'T' + this.details.InTime + 'Z'
      console.log(this.punchIntime)
      this.punchOutTime = today + 'T' + this.details.OutTime + 'Z'
      console.log(this.punchOutTime)
      console.log(this.details);
      this.api.hideLoader();
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
      //   // OutHours: outTimeParts[0],sxsxs
      //   // OutMinutes: outTimeParts[1],
      //   // OutSeconds: outTimeParts[2],
      // };
      // for (let i = 0; i < this.details.length; i++) {
      //   // Check if the attendance has punch-in time but no punch-out time
      //   if (this.details[i]['punchIntime'] !== null && this.details[i]['punchOutTime'] === null) {
      //     // Display the punch-in time and leave the punch-out time blank
      //     console.log('Punch In: ' + this.details['punchIntime']);
      //     console.log('Punch Out: ',"");
      //   }
      // }

    }).catch(error => {
      console.log("error getting data", error);
    })
  }
  
  ngOnInit() {
 
  }
   
}
