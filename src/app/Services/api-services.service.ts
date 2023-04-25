import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { Attendance, Employee, UserAuth } from '../Model/employee-details';
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
  //EmployeeId: number | null = null;gfhvjcxkzcbhz
  baseUrl = 'https://8880-2402-3a80-e7e-a010-48b0-1ecc-9c09-f912.ngrok-free.app/';
  attendance = new Attendance();
  PageNumber:number|any;
  loginData: UserAuth|any;
  private role!: string;
  RoleId: any;
  


  constructor(
   private http:HTTP,
   private loadingController: LoadingController,
   private plt:Platform

  ) {
    this.plt.ready().then((_readySource: any) => {
      this.http.setDataSerializer('json')
    this.http.setHeader('Access-Aontrol-Allow-Origin',this.baseUrl,'')
    // this.http.setHeader('',__RequestAuthToken,this.getToken);
  });
  }
  setRole(role: string) {
    this.role = role;
  }

  getRole(): string {
    return this.role;
  }

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

  uploadImage(formData: any=''){
    // Replace the API endpoint URL with your actual API endpoint
  this.http.setDataSerializer('multipart')
  return this.http.post(this.baseUrl+'api/Upload/UploadAttendanceImage',formData,{});

  }
  imageWithattendance(EmployeeId: number,FileName: string, FilePath: string){
    const gg ={
      "FileName":FileName,
      "FilePath": FilePath
    }
    return this.http.post(this.baseUrl+'api/Attendance/UploadImage?EmployeeId='+EmployeeId,gg,{});
  }

  login(loginData:UserAuth){
     // Replace with your login API endpoint
    return this.http.post(this.baseUrl+'api/Account/Login',loginData,{});
  }

  setEmployeeId(employeeId: number) {
    this.EmployeeId = employeeId;
    console.log(this.EmployeeId)
  }

  getEmployeeId(): number {
    return this.EmployeeId;
  }
  handleMessageType(response:any){
    if(response['MessageType']===1){
      return true
    }
    else{
      return false
    }

  }
  setUserRole(role: string) {
    localStorage.setItem(String(this.RoleId),role);
  }
  

}
