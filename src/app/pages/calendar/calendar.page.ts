import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { LoadingController, Platform } from '@ionic/angular';
import { CalendarComponent, CalendarMode } from 'ionic2-calendar';
import { Attendance } from 'src/app/Model/employee-details';
import { ApiServicesService } from 'src/app/Services/api-services.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {

//for the api

employeeList:Attendance[]=[];
employeeListJson:string |any;
  

  //@ViewChild(CalendarComponent) myCal!:CalendarComponent;

  constructor( private api: ApiServicesService,
    private http:HTTP,
    private plt:Platform,
    private loadingController: LoadingController,
    private router: Router) { }




  
  next() {
    
  }
  back() {
  
  }

  oneEventSelected(date:any){

  }

  onTitleChanged(date:any){

  }

  onTimeSelected(date:any){

  }
 

  ngOnInit() {
    this.plt.ready().then((readySource: any) => {
      console.log('Platform ready from', readySource);
      this.api.showLoader()
      this.api.getAllAttendance().subscribe((res:any)=>{
        console.log(res)
        this.employeeListJson = JSON.parse(res);
        console.log(this.employeeListJson);
        this.employeeList = this.employeeListJson['Result'];   
        console.log(this.employeeList);
        this.api.hideLoader();
      })
    });
 }
 ///dsdsada
}
