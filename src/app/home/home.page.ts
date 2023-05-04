import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ApiServicesService } from 'src/app/Services/api-services.service';
import { Attendance, Employee, ProgressData, UserAuth } from '../Model/employee-details';
import { Chart } from 'chart.js';
import { AlertController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';





@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {

  private punchInTime: Date = new Date(2023, 5, 4, 9, 0, 0); // Static punch in time (9:00 AM)
  private punchOutTimee: Date = new Date(2023, 5, 4, 15, 0, 0);

  private remainingTime: string = '';
  doughnutChart: any;

  page = 1;
  EmployeeId: number | any;
  detailsJson: string | any;
  details: Attendance | any;
  data: UserAuth | any;
  punchIntime!: string;
  punchOutTime!: string;
  progressData: ProgressData | any;

  dateFromApi!: string;
  dummy = '2023-04-03T11:29:23.051Z';

  employee: any;
  roles: any[] = [];


  @ViewChild('doughnutCanvas') private doughnutCanvas!: ElementRef;
  @ViewChild('completedTime') public completedTime!: ElementRef;

  constructor(private api: ApiServicesService, private alertController: AlertController, private popoverController: PopoverController, private router: Router) { }

  showRoleList = false;
  // selectedRole!:string
  selectedRole = this.api.getRole();


  getRoles() {
    this.api.multiRole(this.api.getUserId()).then((res: any) => {
      // debugger
      console.log(res);
      this.detailsJson = JSON.parse(res.data);
      console.log(this.detailsJson);
      this.employee = this.detailsJson['Result'];
      if (this.employee) {
        this.selectedRole = this.api.getRole();
        console.log(this.selectedRole)
      }
      console.log(this.employee);
      // if (this.selectedRole === 'HR') {
      //   this.router.navigate(['/employee-enrollment']);
      //   console.log('emloyee enrollment page')
      // } else if(this.selectedRole === 'Employee'){
      //   this.router.navigate(['/home'])
      // }
    })
  }
  async roless(ev: any) {

    // Call API function to fetch data
    this.api.multiRole(this.api.EmployeeId).then(
      async (response: any) => {
        console.log(response);
        const popover = await this.popoverController.create({
          component: PopoverController,
          event: ev,

          componentProps: {
            roles: response.roles // Pass fetched roles data as component property
          }
        });
        await popover.present();
      },
      (error: any) => {

        console.error('Error fetching roles: ', error);
      }
    );
  }

  selectRole() {
    this.popoverController.dismiss(this.selectedRole);
  }
  async presentPopover(event: any) {
    const popover = await this.popoverController.create({
      component: 'rolePopover',
      event: event
    });
    await popover.present();
  }



  async ionViewDidEnter() {
    await this.attendance();
  }

  ngAfterViewInit() {
    this.doughnutChartMethod();
    this.startDynamicChart();
    // this.startDynamicAnimation();
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
        cutout: 98,
        responsive: true,
        animation: { // Add animation optionsxaxax
          animateRotate: true,
          animateScale: true,
        },

      }
    });
  }
  startDynamicChart() {
    this.doughnutChart.data.datasets[0].data = [0, 0];
    this.doughnutChart.update();
    const employeeId = this.api.getEmployeeId();
    console.log(employeeId)
    const today = new Date().toISOString().slice(0, 10);

    // Call the API service and update the progress data dynamically
    this.api.getProgressData(employeeId, today).then((res: any) => {
      console.log(res);
      this.detailsJson = JSON.parse(res.data);
      console.log(this.detailsJson);
      this.details = this.detailsJson['Result'];
      // const punchIntime = new Date(res.InTime);
      // console.log(punchIntime)
      
      // const punchInTime = new Date(this.detailsJson['Result'][0]['InTime']);
      // const now = new Date();
      // punchInTime.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());
      // console.log(punchInTime)
      const punchInTimeStr = this.detailsJson['Result'][0]['InTime'];
      const [hours, minutes, seconds] = punchInTimeStr.split(':');
      const punchInTime = new Date();
      punchInTime.setHours(parseInt(hours));
      punchInTime.setMinutes(parseInt(minutes));
      punchInTime.setSeconds(parseInt(seconds));
      console.log(punchInTime)
      
      
      const Employee = this.detailsJson['Result'][0]['EmployeeId'];
      console.log(Employee)
     
      
      setInterval(() => {
      const now = new Date();
      const elapsed = now.getTime() - punchInTime.getTime();
      const totalDuration = 10 * 60 * 60 * 1000; // 8 hours in milliseconds

      this.doughnutChart.data.datasets[0].data = [
        elapsed / totalDuration * 100,
        (totalDuration - elapsed) / totalDuration * 100
      ];
      this.doughnutChart.update();

      const elapsedHours = Math.floor(elapsed / (60 * 60 * 1000));
      const elapsedMinutes = Math.floor(elapsed % (60 * 60 * 1000) / (60 * 1000));
      // const elapsedSeconds = Math.floor(elapsed / 1000);
      const elapsedTimeString = `${elapsedHours} hrs: ${elapsedMinutes} mins:`;//${elapsedSeconds}
      const remainingTimeElement = document.getElementById('remainingTime');
      if (remainingTimeElement) {
        remainingTimeElement.textContent = elapsedTimeString;
      }
    }, 1000);
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
      // (<HTMLSpanElement>document.getElementById('remainingTime')!).textContent = elapsedTimeString;
      const remainingTimeElement = document.getElementById('remainingTime');
      if (remainingTimeElement) {
        remainingTimeElement.textContent = elapsedTimeString;
      }
    }, 1000);
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
    // this.getRoles();
    console.log('Selected role  ', this.selectedRole)
  }

}
