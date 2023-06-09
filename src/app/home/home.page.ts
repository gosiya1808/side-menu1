import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiServicesService } from 'src/app/Services/api-services.service';
import { Attendance, ProgressData, UserAuth } from '../Model/employee-details';
import { Chart } from 'chart.js';
import { AlertController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit, OnInit {

 
  doughnutChart: any;

  page = 1;
  EmployeeId: number | any;
  detailsJson: string | any;
  details!: Attendance | any;
  data: UserAuth | any;
  punchIntime!: string | any;
  punchOutTime!: string;
  progressData: ProgressData | any;

  dateFromApi!: string;
  dummy = '2023-04-03T11:29:23.051Z';

  employee: any;
  roles: any = [];
  showRoleList = false;
  selectedRole:any;
  UserName!: string;
  UserPassword!: string;

  loginData: UserAuth = new UserAuth();


  @ViewChild('doughnutCanvas') private doughnutCanvas!: ElementRef;
  @ViewChild('completedTime') public completedTime!: ElementRef;

  constructor(private api: ApiServicesService, private alertController: AlertController, private popoverController: PopoverController, private router: Router,private navCtrl: NavController) {
    this.selectedRole=parseInt(this.api.getRole());
    console.log('ROLE lol',typeof(this.selectedRole))
  }
  setActiveRole(event: any) {
    const employeeId = this.api.getEmployeeId();
    console.log(employeeId)
    // debugger
    const roleid = event.target.value;
    this.api.setRole(roleid);
    window.location.reload();
    // const gg = this.api.setRole();
  }
  getRoles() {
    this.api.multiRole(this.api.getUserId()).then((res: any) => {
      console.log(res);
      this.detailsJson = JSON.parse(res.data);
      console.log(this.detailsJson);
      this.employee = this.detailsJson['Result'];
      console.log(typeof(this.employee[0]['RoleId']));
    })
  }
    

  selectRole() {
    this.selectedRole=parseInt(this.api.getRole());
  }
 
  ionViewDidEnter() {
    this.attendance();
    this.startDynamicChart();
  }
  ngAfterViewInit() {
    this.getRoles();
    console.log('Selected role  ', this.selectedRole)
    this.doughnutChartMethod();

  }
  doughnutChartMethod() {
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        // labels: ['Punch-in', 'Current-time'],
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
        aspectRatio: 1,
        cutoutPercentage: 75,
        responsive: true,
        animation: { // Add animation optionsxaxax
          animateRotate: true,
          animateScale: true,
        }
      }
    });
  }

  startDynamicChart() {
    this.doughnutChart.data.datasets[0].data = [0, 0];
    // this.doughnutChart.update();
    const employeeId = this.api.getEmployeeId();
    console.log(employeeId)
    const today = new Date().toISOString().slice(0, 10);
    this.api.getProgressData(employeeId, today).then((res: any) => {
      console.log(res);
      this.detailsJson = JSON.parse(res.data);
      console.log(this.detailsJson);
      this.details = this.detailsJson['Result'];
      const inputTime = this.detailsJson['Result'][0]['InTime'];

      console.log('outtime', this.punchOutTime)
      const [hours, minutes, seconds] = inputTime.split(':').map(Number);

      const date = new Date();
      date.setHours(hours + 5);
      date.setMinutes(minutes + 30);
      date.setSeconds(seconds);

      const options = { timeZone: 'Asia/Kolkata', hour12: false };
      const outputTime = date.toLocaleTimeString('en-US', options);
      const chart_punchIntime = new Date(date);
      this.punchIntime = chart_punchIntime
      this.punchIntime = outputTime;

      console.log(chart_punchIntime);
      console.log(this.punchIntime);

      const gg = setInterval(() => {
        if (this.punchOutTime) {
          clearInterval(gg);
        }
        //    const now = new Date();
        //    console.log('chat punch ',chart_punchIntime)
        //   const elapsed = now.getTime() - chart_punchIntime.getTime();//Thu May 11 2023 05:29:52 GMT+0530 (India Standard Time)
        //   const totalDuration =28800000 ; // 8 hours in milliseconds
        //   console.log('Elapsed', elapsed);

        //   this.doughnutChart.data.datasets[0].data = [
        //      elapsed, (8 * 60 * 60 * 1000) - (elapsed),
        //   ];
        //   this.doughnutChart.update();

        //   const elapsedHours = Math.floor(elapsed / (60 * 60 * 1000));
        //   const elapsedMinutes = Math.floor(elapsed % (60 * 60 * 1000) / (60 * 1000));
        //   // const elapsedSeconds = Math.floor(elapsed / 1000);
        //   const elapsedTimeString = `${elapsedHours} hrs: ${elapsedMinutes} mins:`;//${elapsedSeconds}
        //   const remainingTimeElement = document.getElementById('remainingTime');
        //   if (remainingTimeElement) {
        //     remainingTimeElement.textContent = elapsedTimeString;
        //   }
      }, 1000);
      // Update the punchInTime and punchOutTime variables with actual values

      // Calculate elapsed time
      const punchInTime = new Date(chart_punchIntime); // Replace with actual punch in time
      const punchOutTime = new Date(this.punchOutTime); // Replace with actual punch out time (or null if not available)
      const now = new Date();
      const eightHoursInMillis = 8 * 60 * 60 * 1000;
      const elapsed = Math.min(now.getTime() - punchInTime.getTime(), eightHoursInMillis); // Limit elapsed time to 8 hours

      // Calculate remaining time
      const remaining = eightHoursInMillis - elapsed;

      // Update chart data and labels
      this.doughnutChart.data.datasets[0].data = [elapsed, remaining];
      this.doughnutChart.update();
      const elapsedHours = Math.floor(elapsed / (60 * 60 * 1000));
      const elapsedMinutes = Math.floor(elapsed % (60 * 60 * 1000) / (60 * 1000));
      // const elapsedSeconds = Math.floor(elapsed / 1000);
      const elapsedTimeString = `${elapsedHours} hrs: ${elapsedMinutes} mins:`;//${elapsedSeconds}
      const remainingTimeElement = document.getElementById('remainingTime');
      if (remainingTimeElement) {
        remainingTimeElement.textContent = elapsedTimeString;
      }
    });
  }

  attendance() {
    const employeeId = this.api.getEmployeeId();
    console.log(employeeId)
    const today = new Date().toISOString().slice(0, 10);
    // this.api.showLoader();
    this.api.getAttendanceById(employeeId, today).then((res: any) => {
      console.log(res);
      this.detailsJson = JSON.parse(res.data);
      console.log(this.detailsJson);
      this.details = this.detailsJson['Result'];
      // this.punchIntime = today + 'T' + this.details.InTime + 'Z'
      // console.log(this.punchIntime)
      // this.punchOutTime = today + 'T' + this.details.OutTime + 'Z'
      // console.log(this.punchOutTime)
      // console.log(this.details);
      const inputTime = this.details.InTime;
      //       const [hours, minutes, seconds] = inputTime.split(':').map(Number);

      //       const date = new Date();
      //       date.setHours(hours);
      //       date.setMinutes(minutes);
      //       date.setSeconds(seconds);

      const options = { timeZone: 'Asia/Kolkata', hour12: false };
      //       const outputTime = date.toLocaleString('en-US', options);

      //       this.punchIntime = new Date(outputTime).toISOString();
      // console.log(this.punchIntime);

      // Parse the punch out time and construct a Date object
      // if(this.details.OutTime){

        const OutTime = this.details.OutTime;
        const [hours1, minutes1, seconds1] = OutTime.split(':').map(Number);
  
        const date1 = new Date();
        date1.setHours(hours1);
        date1.setMinutes(minutes1);
        date1.setSeconds(seconds1);
        const outputTime1 = date1.toLocaleTimeString('en-US', options);
  
        this.punchOutTime = outputTime1;
        console.log(this.punchOutTime);
        //  this.api.hideLoader();
      // }

    }).catch(error => {
      console.log("error getting data", error);
    })
  }
  
  ngOnInit() {

  }

}
