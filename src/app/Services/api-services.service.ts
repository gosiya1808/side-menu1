import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HTTP } from '@ionic-native/http/ngx';
import { Attendance, Employee } from '../Model/employee-details';
import { LoadingController } from '@ionic/angular';



@Injectable({
  providedIn: 'root'
})
export class ApiServicesService {
  AttendanceId:any;
  EmployeeId:any;
  baseUrl = 'https://8a7a-116-72-9-56.in.ngrok.io/';
  attendance = new Attendance();
  PageNumber:number|any;
  


  constructor(
   private http:HTTP,
   private loadingController: LoadingController,

  ) {
    this.http.setHeader('Access-Aontrol-Allow-Origin',this.baseUrl,'')
  }

 

  // getEmployess(): Observable<Employee[]>{
  //   return this.http.get(this.baseUrl+'api/Employee/GetAllEmployees/')
  // }
  //get ki jagah post kiya 
  getEmployess(PageNumber:number,PageSize:number=30): Observable<Employee[]>{
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

  getAttendanceById(EmployeeId: number){
    return this.http.get(this.baseUrl+'api/Attendance/GetAttendanceById?attendanceId='+EmployeeId,{},{});
  }




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
  
  // getAttendancebyId(AttendanceId:number): Observable<Attendance[]> {
  //   return new Observable<Attendance[]>(observer => {
  //     this.http.get(this.baseUrl+'api/Attendance/GetAttendanceById?attendanceId='+AttendanceId, {}, {}).then(response => {
  //       console.log("data coming :",response);
  //     }).catch(error => {
  //       observer.error(error);
  //     });
  //   });
  // }

  
  addAttendance(attendance: Attendance) {
    return this.http.post(this.baseUrl+'api/Attendance/SaveAttendanceDetails', attendance,{});
  }
  //parameter change kiya hai 
  updateAttedance(attendance: Attendance){
    const g={
      //"AttendanceId":this.AttendanceId,nahi ho to ye comment remove kar dena 
      "AttendanceId":this.AttendanceId,
      "OutLatitude":attendance.OutLatitude,
      "OutLongitude":attendance.OutLongitude,
      "OutDiscription":attendance.OutDiscription
    }
    return this.http.post(this.baseUrl+'api/Attendance/UpdateAttendance',g,{});
  }
  
  async showLoader()
  {
    const loading = await this.loadingController.create({
      message:'please wait.....',
      spinner:'crescent',
      duration:3000
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
