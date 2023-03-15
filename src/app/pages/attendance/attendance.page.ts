import { Component, OnInit, ViewChild } from '@angular/core';
import { Attendance } from 'src/app/Model/employee-details';
import { HTTP } from '@ionic-native/http/ngx';
import { ApiServicesService } from 'src/app/Services/api-services.service';
import { Platform } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.page.html',
  styleUrls: ['./attendance.page.scss'],
})
export class AttendancePage implements OnInit {


  attendanceList:Attendance[]=[];
  attendanceListJson:string|any;
  page=1;
  //abc='D:/side-menu/src/assets/images/back.svg';

  constructor(
    private api: ApiServicesService,
    private http:HTTP,
    private plt:Platform,
    private loadingController: LoadingController,
    private navCtrl:NavController
  ) { }


  

  ngOnInit() {
    this.loadData();
  }

  async loadData(loadMore=false) {
      if(loadMore){
        this.page=this.page+1;
      }
      this.api.showLoader();
      (this.api.getAttendance()).subscribe((res:any)  =>{
        this.attendanceListJson = JSON.parse(res);
        console.log(this.attendanceListJson);
        this.attendanceList = this.attendanceListJson['Result'];   
        console.log(this.attendanceList);
        this.api.hideLoader();
      });
        
    }

}
