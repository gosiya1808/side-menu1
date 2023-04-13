import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { Attendance, Employee } from '../Model/employee-details';
import { LoadingController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { Observable, from } from 'rxjs';
import { Platform } from '@ionic/angular';




@Injectable({
  providedIn: 'root'
})
export class ApiServicesService {
  AttendanceId:any;
  EmployeeId:any;
  //EmployeeId: number | null = null;
  baseUrl = 'https://cd08-2402-3a80-16a6-5572-184a-32ac-17a5-70f2.ngrok-free.app/';
  attendance = new Attendance();
  PageNumber:number|any;
  


  constructor(
   private http:HTTP,
   private loadingController: LoadingController,
   private plt:Platform

  ) {
    this.plt.ready().then((_readySource: any) => {
    this.http.setHeader('Access-Aontrol-Allow-Origin',this.baseUrl,'')
  });
  }
  getEmployess(PageNumber:number,PageSize:number=50): Observable<Employee[]>{
    const gg={
      'CurrentPageNumber':PageNumber,
      'PageSize':PageSize
    }
    return new Observable<Employee[]>(observer => {
      this.http.post(this.baseUrl+'api/Employee/GetAllEmployee',gg, {}).then(response => {
        observer.next(response.data);
        observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });
  }

  getEmployessById(EmployeeId: number){
    return this.http.get(this.baseUrl+'api/Employee/GetEmployeeById?employeeId='+EmployeeId,{},{});
  }
   getAttendanceById(EmployeeId: number, Date:String){
    return this.http.get(this.baseUrl+'api/Attendance/GetAttendanceById?employeeId='+EmployeeId+'&date='+Date,{},{});
  }
  getAttendanceByEmployeeIdxyz(EmployeeId: number): Observable<Attendance>{ 
    return from(this.http.get(this.baseUrl+'api/Attendance/GetAttendanceById?employeeId='+EmployeeId,{},{})).pipe(
      map((data: any) => {
        const serverDateTime = new Attendance();
        serverDateTime.Date = data.Date;
        serverDateTime.InTime = data.InTime;
        serverDateTime.OutTime = data.OutTime;
        return serverDateTime;
      })
    );
  }
  
  checkAttendance(EmployeeId: number, Date:string){
    return this.http.get(this.baseUrl+'api/Attendance/GetAttendanceById?employeeId='+EmployeeId+'&date='+Date,{},{});
  }

  checkAttendanceForPunchOut(EmployeeId: number){
    return this.http.get(this.baseUrl+'api/Attendance/AttendanceStatus?employeeId='+EmployeeId,{},{});
  }

  getAllAttendance(): Observable<Attendance[]> {
    return new Observable<Attendance[]>(observer => {
      this.http.get(this.baseUrl+'api/Attendance/GetAllAttendance', {}, {}).then(response => {
        observer.next(response.data);
        observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });
  }
  
  addAttendance(attendance: Attendance,employeeId: number) {
    attendance.EmployeeId = employeeId;
    return this.http.post(this.baseUrl+'api/Attendance/SaveAttendanceDetails', attendance,{});
  }
  updateAttedance(attendance: Attendance,EmployeeId:number){
    const g={
      "EmployeeId":EmployeeId,
      "OutLatitude":attendance.OutLatitude,
      "OutLongitude":attendance.OutLongitude,
      "OutDiscription":attendance.OutDiscription
    }
    return this.http.post(this.baseUrl+'api/Attendance/UpdateAttendance',g,{});
  }
  
  getAttendanceByEmployeeId(EmployeeId: number){
    return this.http.get(this.baseUrl+'api/Attendance/GetAllAttendanceById?employeeId='+EmployeeId,{},{});
  }

  async showLoader()
  {
    const loading = await this.loadingController.create({
      message:'<div class="spinner"><div></div><div></div><div></div><div></div><div></div></div>',
      spinner:null,
      translucent: true,
      cssClass: 'custom-loading',
      // duration:10
    });
    await loading.present();
  }
  async hideLoader()
  {
    const loading = await this.loadingController.getTop();
    if(loading){
      await loading.dismiss();
    }
  }
}
