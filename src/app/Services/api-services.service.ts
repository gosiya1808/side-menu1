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
  baseUrl = 'https://001a-2402-3a80-16a0-7837-862-26b4-928e-b275.ngrok-free.app/';
  attendance = new Attendance();
  PageNumber:number|any;
  loginData: UserAuth|any;
  private role!: string;
  RoleId: any;
  filename!:string;
  filepath!:string;
  


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
  
  addAttendance(attendance: Attendance, employeeId: number): Promise<boolean> {
    this.http.setDataSerializer('json');
  
    attendance.EmployeeId = employeeId;
    
    return new Promise<boolean>((resolve, reject) => {
      this.http.post(this.baseUrl + 'api/Attendance/SaveAttendanceDetails', attendance, {}).then((res) => {
        const gg = {
          "FileName": this.getImagefilename(),
          "FilePath": this.getImagefilepath()
        };
  
        this.http.post(this.baseUrl + 'api/Attendance/UploadImage?EmployeeId=' + employeeId, gg, {}).then((res1) => {
          resolve(true);
        }).catch((error) => {
          console.log('Error: upload', error);
          reject(false);
        });
      }).catch((error) => {
        console.log('Error: add att', error);
        reject(false);
      });
    });
  }

  updateAttedance(attendance: Attendance,EmployeeId:number):Promise<boolean>{
    this.http.setDataSerializer('json')
    const g={
      "EmployeeId":EmployeeId,
      "OutLatitude":attendance.OutLatitude,
      "OutLongitude":attendance.OutLongitude,
      "OutDiscription":attendance.OutDiscription
    }
    return new Promise<boolean>((resolve, reject) => {
    this.http.post(this.baseUrl+'api/Attendance/UpdateAttendance',g,{}).then((res)=>{
      console.log(res);
      const gg ={
        "FileName":this.getImagefilename(),
        "FilePath": this.getImagefilepath()
      }
      this.http.post(this.baseUrl + 'api/Attendance/UploadImage?EmployeeId=' + EmployeeId, gg, {}).then((res1) => {
        resolve(true);
      }).catch((error) => {
        console.log('Error: upload', error);
        reject(false);
      });
    }).catch((error) => {
      console.log('Error: add att', error);
      reject(false);
    });
  });
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
  return this.http.post(this.baseUrl+'api/Upload/UploadAttendanceImage',formData,{})

  }
  // imageWithattendance(EmployeeId: number,FileName: string, FilePath: string){
  //   debugger
  //   const gg ={
  //     "FileName":FileName,
  //     "FilePath": FilePath
  //   }
  //   this.http.setDataSerializer('json')
  //   return this.http.post(this.baseUrl+'api/Attendance/UploadImage?EmployeeId='+EmployeeId,gg,{});
  
  // }

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

  setImagefilename(FileName:any){
    this.filename = FileName;
    console.log(this.filename);
  }
  setImagefilepath(FilePath:any){
    this.filepath = FilePath;
    console.log(this.filepath);
  }
  getImagefilename(){
    return this.filename;
  }
  getImagefilepath(){
    return this.filepath
  }

  // handleMessageType(response:any){
  //   if(response['MessageType']===1){
  //     return true
  //   }
  //   else{
  //     return false
  //   }

  // }
  // setUserRole(role: string) {
  //   localStorage.setItem(String(this.RoleId),role);
  // }
  

}
