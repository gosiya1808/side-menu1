import { Component, OnInit } from '@angular/core';
import { Attendance, Employee } from 'src/app/Model/employee-details';
import { ModalController } from '@ionic/angular';
import { Data, Router } from '@angular/router';
import { ApiServicesService } from 'src/app/Services/api-services.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';


@Component({
  selector: 'app-add-attendance',
  templateUrl: './add-attendance.page.html',
  styleUrls: ['./add-attendance.page.scss'],
})
export class AddAttendancePage implements OnInit {

  details = new Attendance();
  data = new Attendance();
  attendanceMarked: boolean = false;
  isWeekend?: boolean ;
  isPunchedIn?: boolean;
  dummy = new Attendance();
  dataJson: string | any;
  AttendanceId: any;
  employeeId: number | any;
  submitDisabled?: boolean = false;
  //detailsJson:string|any;

  constructor(
    private api: ApiServicesService,
    public modalCtrl: ModalController,
    private router: Router,
    private geolocation: Geolocation,
    private toastController: ToastController,
    private storage: Storage
  ) {
    // this.getCurrentCoordinates();
  }

  async ionViewDidEnter() {
      await this.checkAttendanceStatus();
      this.checkWeekend();
  }


  checkAttendanceStatus() {
    const EmployeeId = 8;
    const today = new Date().toISOString().slice(0, 10);
    console.log(today); // replace with the actual employee id
    this.api.getAttendanceById(EmployeeId,today).then(response => {
      const attendanceList = JSON.parse(response.data);
      console.log(attendanceList);
      this.details = attendanceList['Result'];
      console.log(this.details);  
      if (attendanceList && attendanceList['Result']) {
        this.attendanceMarked = true;
        console.log('attendance marked is true');
        this.submitDisabled = true;
        console.log('already have attendance of today!!');
        this.isPunchedIn = true;
        console.log('punched marked is true');
      }else {
        this.attendanceMarked = false;
        console.log('attendance marked is false');
        this.submitDisabled = false;
        console.log('You can do attendance today!!');
        this.isPunchedIn = false;
        console.log('punched marked is false');
      }
    }).catch(error => {
      console.error('Error fetching attendance:', error);
    });
  }

  async checkWeekend() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    if(this.isWeekend = (dayOfWeek === 0 || dayOfWeek === 6)){
      console.log("sorry cant do attendance!! WeekOff")
      const toast = await this.toastController.create({
        message: 'Sorry today is WeekOff!',
        duration: 2000, 
        position: 'bottom' 
      });
      toast.present(); 
      toast.onDidDismiss().then(() => {
        this.navigate();
      });
      this.isWeekend = true;
    }else{
      console.log("you can do entry today");
      this.isWeekend = false;
    }

  }

  // onSubmit() {
  //   this.api.addAttendance(this.data,26)
  //     .then(async response => {
  //       console.log('added successfully:', response);
  //       this.api.EmployeeId=JSON.parse(response.data)
  //       this.api.EmployeeId=this.api.EmployeeId['Result']
  //       console.log(this.api.EmployeeId)
  //       // this.attendanceMarked = true;
  //       // console.log('attendance marked is now true');
  //       const toast = await this.toastController.create({
  //         message: 'You have attendance successfully!',
  //         duration: 2000, 
  //         position: 'bottom' 
  //       });
  //       toast.present();  
  //       setTimeout(() => {
  //         this.navigate();
  //       }, 2000);
  //     })
  //     .catch(error => {
  //       console.error('Error adding user:', error);
  //     });   
  // }


  navigate() {
    this.router.navigate(['home'])
  }
  async dismiss() {
    return await this.modalCtrl.dismiss();
  }
  getCurrentCoordinates() {
    this.api.showLoader();
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp)
      this.data.InLatitude = resp.coords.latitude;
      this.data.InLongitude = resp.coords.longitude;
      this.api.hideLoader();
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  getCurrentCoordinatesPunchOut() {
    this.api.showLoader();
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp)
      this.data.OutLatitude = resp.coords.latitude;
      this.data.OutLongitude = resp.coords.longitude;
      this.api.hideLoader();
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  //yaha se change kiya hai
//essgdbdbdb
    onPunchIn() {
      // const today = new Date().toISOString().slice(0, 10);
      // this.api.checkAttendance(1,today).then((data:any)=>{
      //   if (data.length > 0) {
      //     // An attendance record already exists for this employee and today's date
      //     this.submitDisabled = true;
      //     alert('You have already entered attendance for today.');
      //   } else {
      //     this.api.addAttendance(this.data,1)
      //     .then(async response => {
      //       console.log('added successfully:', response);
      //       this.api.EmployeeId = JSON.parse(response.data)
      //       this.api.EmployeeId = this.api.EmployeeId['Result']
      //       console.log(this.api.EmployeeId)
      //       // this.attendanceMarked = true;
      //       // console.log('attendance marked is now true');
      //       const toast = await this.toastController.create({
      //         message: 'You have attendance successfully!',
      //         duration: 2000,
      //         position: 'bottom'
      //       });
      //       toast.present();
      //       setTimeout(() => {
      //         // this.navigate();
      //       }, 2000);
      //     })
      //     .catch(error => {
      //       console.error('Error adding user:', error);
      //     });
      //  // this.isPunchedIn = true;
      //   }
      // })
   // Logic for punch-in action
    this.api.addAttendance(this.data,8)
      .then(async response => {
        console.log('added successfully:', response);
        this.api.EmployeeId = JSON.parse(response.data)
        this.api.EmployeeId = this.api.EmployeeId['Result']
        console.log(this.api.EmployeeId)
        // this.attendanceMarked = true;
        // console.log('attendance marked is now true');
        const toast = await this.toastController.create({
          message: 'You have attendance successfully!',
          duration: 2000,
          position: 'bottom'
        });
        toast.present();
        setTimeout(() => {
          // this.navigate();
        }, 2000);
      })
      .catch(error => {
        console.error('Error adding user:', error);
      });
    this.isPunchedIn = true;

  }

  onPunchOut() {
    // Logic for punch-out action

    this.api.updateAttedance(this.data)
      .then(async response => {
        console.log('updated successfully:', response);
        this.dataJson = JSON.parse(response.data);
        console.log(this.dataJson);
        this.data = this.dataJson['Result'];
        console.log(this.data);
        const toast = await this.toastController.create({
          message: 'You have attendance successfully!',
          duration: 2000,
          position: 'bottom'
        });
        toast.present();
        toast.onDidDismiss().then(() => {
          this.navigate();
        });
      })
      .catch(error => {
        console.error('Error updating data:', error);
      });
    this.isPunchedIn = false;
  }



  ngOnInit() {

  }
}
