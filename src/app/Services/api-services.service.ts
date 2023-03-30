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
  baseUrl = 'https://fb4b-2402-3a80-16ad-e0ae-a86b-18f9-682d-48fb.in.ngrok.io/';
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

 

  // getEmployess(): Observable<Employee[]>{
  //   return this.http.get(this.baseUrl+'api/Employee/GetAllEmployees/')
  // }
  //get ki jagah post kiya 
  getEmployess(PageNumber:number,PageSize:number=50): Observable<Employee[]>{
    const gg={
      'CurrentPageNumber':PageNumber,
      'PageSize':PageSize
    }
    return new Observable<Employee[]>(observer => {
      this.http.post(this.baseUrl+'api/Employee/GetAllEmployees',gg, {}).then(response => {
        observer.next(response.data);
        observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });
  }

  getEmployessById(EmployeeId: number){
    // const params = {
    //   'EmployeeId': this.EmployeeId
    // };
    return this.http.get(this.baseUrl+'api/Employee/GetEmployeeById?employeeId='+EmployeeId,{},{});
  }
 
  //yaha pe date add kiya hai wokr na kare to nikal dena 
  getAttendanceById(EmployeeId: number, Date:String){
    return this.http.get(this.baseUrl+'api/Attendance/GetAttendanceById?employeeId='+EmployeeId+'&date='+Date,{},{});
  }

  //ye attendance ke liye kiya hai
  getAttendanceByEmployeeId(EmployeeId: number): Observable<Attendance>{ 
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
    // const g={
    //   "Date":Date
    // }
    return this.http.get(this.baseUrl+'api/Attendance/GetAttendanceById?employeeId='+EmployeeId+'&date='+Date,{},{});
  }

  // checkAttendance(EmployeeId: number, Date: string){
  //   const url = `${this.baseUrl}api/attendance?employeeId=${EmployeeId}&Date=${Date}`;
  //   return this.http.get(url,{},{});
  // }

  getAttendance(): Observable<Attendance[]> {
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
  //parameter change kiya hai 
  updateAttedance(attendance: Attendance){
    const g={
      //"AttendanceId":this.AttendanceId,nahi ho to ye comment remove kar dena 
      "EmployeeId":this.EmployeeId,
      "OutLatitude":attendance.OutLatitude,
      "OutLongitude":attendance.OutLongitude,
      "OutDiscription":attendance.OutDiscription
    }
    return this.http.post(this.baseUrl+'api/Attendance/UpdateAttendance',g,{});
  }
  
  async showLoader()
  {
    const loading = await this.loadingController.create({
      message:'Loading.....',
      spinner:'crescent',
      translucent: true,
      cssClass: 'custom-loading'
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
