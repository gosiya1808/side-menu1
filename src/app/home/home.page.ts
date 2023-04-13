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
  // attendance: Attendance | any;
  // punchInTime!: Date;
  // punchOutTime!: Date;
  // progressPercentage: number = 0;
  // totalTime: number = 60; // total time in seconds
  // intervalId: any; 
  // strokeDashArray: string = '0, 439.8223650461362';
  private punchInTime: Date = new Date(2023, 3, 13, 9, 0, 0); // Static punch in time (9:00 AM)
  private punchOutTimee: Date = new Date(2023, 3, 13, 17, 0, 0);
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
  @ViewChild('titleDiv') titleDiv!: ElementRef;
  
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
        labels: ['Punch-in', 'Punch-out'],
        datasets: [{
          label: 'timing',
          data: [0, 0],
          backgroundColor: [
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)'
          ],
          hoverBackgroundColor: [
            '#FFCE56',
            '#FF6384',
          ]
        }]
      },
      options: {
        animation: { // Add animation options
          animateRotate: true,
          animateScale: true
        },
      }
      
    });
  }
  startDynamicAnimation(): void {
    // Update the chart data with 0 values initially
    this.doughnutChart.data.datasets[0].data = [0, 0];
    this.doughnutChart.update();

    // Start updating the chart data and title at regular intervals
    setInterval(() => {
      const now = new Date();
      const elapsed = now.getTime() - this.punchInTime.getTime();
      const totalDuration = this.punchOutTimee.getTime() - this.punchInTime.getTime();
      const remaining = this.punchOutTimee.getTime() - now.getTime(); // Fix this line

      // Update the chart data with the elapsed time in percentage
      this.doughnutChart.data.datasets[0].data = [
        elapsed / totalDuration * 100,
        (totalDuration - elapsed) / totalDuration * 100
      ];
      this.doughnutChart.update();

      // Update the remaining time in the middle of the chart
      const remainingTime = new Date(remaining);
      const remainingHours = Math.floor(remainingTime.getTime() / (60 * 60 * 1000));
      const remainingMinutes = Math.floor(remainingTime.getTime() % (60 * 60 * 1000) / (60 * 1000));
      // this.titleDiv.textContent = `${remainingHours} hours ${remainingMinutes} minutes`;
    }, 1000); // Update every 1 second
  }

  attendance() {
    const EmployeeId = 1;
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
