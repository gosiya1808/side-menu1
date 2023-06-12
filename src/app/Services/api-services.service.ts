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
  baseUrl = 'https://b035-150-107-241-38.ngrok-free.app/';
  attendance = new Attendance();
  PageNumber:number|any;
  loginData: UserAuth|any;
  private role!: string;
  RoleId: any;
  filename!:string;
  filepath!:string;

  private username!: string;
  private password!: string;

  private UserId!:number;

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
    localStorage.setItem('role',role)
    this.role = role;
  }

  getRole(){
    return localStorage.getItem('role') as string ;
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
  this.http.setDataSerializer('multipart')
  return this.http.post(this.baseUrl+'api/Upload/UploadAttendanceImage',formData,{})

  }

  login(loginData:UserAuth){
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

  multiRole(EmployeeId:number){
    return this.http.get(this.baseUrl+'api/Designations/GetRoles?UserId='+EmployeeId,{},{})
  }
  setUserId(userId:number){
    this.UserId = userId
  }
  getUserId(){
    return this.UserId
  }

  logout(){
    return this.http.post(this.baseUrl+'api/Account/Logout',{},{}).then(() => {
    }, (error:any) => {
      console.error(error);
    });
  }

  getProgressData(EmployeeId: number, Date:String){
    return this.http.get(this.baseUrl+'api/Attendance/GetInTimeByEmployeeId?employeeId='+EmployeeId+'&date='+Date,{},{});
  } 

  //forgot password 
  verifyCode(code:string, EmployeeId:number){
    const g={
      'EmployeeID': EmployeeId,
      'Code': code
    }
    return this.http.post(this.baseUrl+'api/Account/VerifyCode',g,{})
  }

  getRandomString(id:number){
    return this.http.post(this.baseUrl+'api/Account/GetRandomString?id='+id,{},{})
  }

  getUsersDetails(email: string){
    return this.http.get(this.baseUrl+'api/Account/getusersdetails?user='+email,{},{})
  }

  updatePassword(user: string){
    return this.http.post(this.baseUrl+'api/Account/UpdatePassword?user='+user,{},{})
  }

}
