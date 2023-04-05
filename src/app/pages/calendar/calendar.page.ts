import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { LoadingController, Platform } from '@ionic/angular';
import { CalendarComponent, CalendarMode } from 'ionic2-calendar';
import { Attendance } from 'src/app/Model/employee-details';
import { ApiServicesService } from 'src/app/Services/api-services.service';
import { IEvent } from 'ionic2-calendar/calendar.interface';
import { MenuController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { DatePipe } from '@angular/common';
import { AlertController } from '@ionic/angular';


function getRandomDate(): Date {
  const date = new Date();
  const daysOffset = Math.floor(Math.random() * 90) - 45;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + daysOffset);
}

function getRandomTime(startDate: Date): Date {
  const minutesOffset = Math.floor(Math.random() * 24 * 60);
  return new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, startDate.getMinutes() + minutesOffset);
}



@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  providers: [DatePipe]
})
export class CalendarPage implements OnInit {

  //for the api

  // employeeList:Attendance[]=[];
  // employeeListJson:string |any;



  eventSource: IEvent[] = [];
  list: any;
  viewTitle!: string;


  calendar = {
    mode: 'month' as CalendarMode,
    currentDate: new Date(),
  };

  @ViewChild(CalendarComponent) myCal!: CalendarComponent;


  constructor(private api: ApiServicesService,
    private http: HTTP,
    private plt: Platform,
    private loadingController: LoadingController,
    private router: Router,
    private menuController: MenuController,
    private alertCtrl: AlertController,
    private datePipe: DatePipe
  ) { }

  ionViewWillEnter() {
    this.menuController.enable(true, 'gg');
    console.log("fired");
  }

  ionViewWillLeave() {
    this.menuController.enable(false, 'gg');
    console.log("fired1");
  }

  next() {
    this.myCal.slideNext();
  }
  back() {
    this.myCal.slidePrev();
  }

  today() {
    this.calendar.currentDate = new Date();
  }

  onViewTitleChanged(title: string) {
    this.viewTitle = title;
  }

  oneEventSelected(date: any) {

  }

  onloadAttendanceDetails() {
    const today = new Date().toISOString().slice(0, 10);
    const EmployeeId = 5;
    const events: any[] = [];
    this.api.getAttendanceByEmployeeId(EmployeeId).then(res => {
      this.list = JSON.parse(res.data);
      this.list = this.list['Result'];
      console.log(this.list);
      this.list.forEach((element: any) => {
        const startDateTime = new Date(element.Date);
        const endDateTime = new Date(startDateTime);
        endDateTime.setHours(startDateTime.getHours() + 1);

        const stime = this.datePipe.transform(element.Date,'h:mm:ss a')
        console.log(stime)

        // const startTime = today+'T'+startDateTime+'z'
        // console.log(startTime);
        // this.startTime = today+'T'+element.InTime+'Z'
        // console.log(this.startTime)
        // this.endTime = today+'T'+element.OutTime+'Z'
        // console.log(this.endTime)

        // const isoStartTime = startDateTime.toISOString();
        // const isoEndTime = endDateTime.toISOString();

        // const startTime = isoStartTime.slice(0, 10) + 'T' + element.Date.slice(16, 24) + 'z';
        // const endTime = isoEndTime.slice(0, 10) + 'T' + endDateTime.toTimeString().slice(0, 8) + 'z';
        const title = `Click here!! for Attendance details`;
        events.push({
          title: title,
          inTime: element.InTime,
          outTime: element.OutTime,
          startTime: startDateTime,
          endTime: endDateTime,
          Outdesc: element.OutDiscription,
          Indesc: element.InDiscription
        });
      })
      this.eventSource = events;

      console.log(this.eventSource);
    }).catch((error: any) => {
      console.error('Error fetching attendance:', error);
    });
  }

  async onEventSelected(event: IEvent) {
    const start = formatDate(event.startTime, 'shortTime', 'en-US');
    const end = formatDate(event.endTime, 'medium', 'en-US');
    console.log(this.eventSource);
    const alert = await this.alertCtrl.create({
      // message: `<div class="cal-alert-time"><ion-icon class="cal-alert-svg" name="time-outline"></ion-icon>${start}</div><div class="cal-alert-time fw-bold"><ion-icon class="cal-alert-svg"  name="person-sharp"></ion-icon> ${event.ApplicantName}</div><div class="cal-alert-interviewer"><span><ion-icon class="cal-alert-svg2" name="attach-outline"></ion-icon></span>${event.InterviewerName}</div>`, <span>${event.Outdesc}</span></p>
      message: `<div>
      <h2 class="mb-2">Attendance Details</h2>
      <p  class="mb-1"><span class="mr-2"><ion-icon name="time-outline" class="mr-5"></ion-icon></span><span>InTime: <span class="fw-bold">${event.inTime}</span></span></p>
      <p  class="mb-1"><span class="mr-2"><ion-icon name="document-text-outline"class="mr-5"></ion-icon></span><span>InDesc: <span class="fw-bold">${event.Indesc}</span></span></p>
      <p  class="mb-1"><span class="mr-2"> <ion-icon name="time-outline" class="mr-5"></ion-icon>OutTime: ${event.outTime} </span></p>
      <p  class="mb-1"><span class="mr-2"><ion-icon name="document-text-outline" class="mr-5"></ion-icon></span><span>OutDesc: <span class="fw-bold">${event.Outdesc}</span></span></p>
      </div>`,
       buttons:  [{
        text: 'ok',
        role: 'cancel',
        handler: () => {},
      }],
    });
    alert.present();
  }

  handleRefresh(event:any) {
    setTimeout(() => {
      this.onloadAttendanceDetails();
      event.target.complete();
    }, 2000);
  }

  ngOnInit() {
    this.plt.ready().then(_ => {
      this.onloadAttendanceDetails()
    })
  }
  
}
