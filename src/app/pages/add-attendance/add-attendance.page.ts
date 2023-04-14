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
  isWeekend?: boolean;
  isPunchedIn?: boolean;
  dummy = new Attendance();
  dataJson: string | any;
  AttendanceId: any;
  employeeId: number | any;
  submitDisabled?: boolean;

  constructor(
    private api: ApiServicesService,
    public modalCtrl: ModalController,
    private router: Router,
    private geolocation: Geolocation,
    private toastController: ToastController,
    private storage: Storage
  ) {
    // this.getCurrentCoordinatesPunchOut();
  }

  async ionViewDidEnter() {
    await this.checkAttendanceStatus();
    this.checkWeekend();
  }

  // checkPunchOutStatus() {
  //   const employeeId = 46;
  //   const today = new Date().toISOString().slice(0, 10);
  //   console.log(today); 
  //   this.api.getAttendanceById(employeeId, today).then(response => {
  //     const attendanceList = JSON.parse(response.data);
  //     console.log(attendanceList);
  //     this.details = attendanceList['Result'];
  //     console.log(this.details);
  //     if (attendanceList['Result']['OutLatitude'] && attendanceList['Result']['OutLongitude'] && attendanceList['Result']['OutDescription']) {
  //       this.attendanceMarked = true;
  //       console.log(" marked true");
  //       this.submitDisabled = true;
  //       console.log(" submitted true");
  //     } else {
  //       this.attendanceMarked = false;
  //       console.log(" markedfalse");
  //       this.submitDisabled = false;
  //       console.log(" submitted false");
  //     }
  //   }).catch((error: any) => {
  //     console.error('Error fetching attendance:', error);
  //   });
  // }

  checkAttendanceStatus() {
    const EmployeeId = 12;
    const today = new Date().toISOString().slice(0, 10);
    console.log(today);
    this.api.showLoader();
    this.api.getAttendanceById(EmployeeId, today).then(async response => {
      const attendanceList = JSON.parse(response.data);
      console.log(attendanceList);
      this.details = attendanceList['Result'];
      console.log(this.details);
      this.api.hideLoader();
      if (this.details) {
        this.attendanceMarked = true;
        console.log('attendance marked is true');
        this.submitDisabled = true;
        console.log('already have attendance of today!!');
        this.isPunchedIn = true;
        console.log('punched marked is true');
        const result = attendanceList['Result'];
        if (result['OutTime'] != null) {
          this.submitDisabled = true;
          console.log('User has already attendance for the day');
          const toast = await this.toastController.create({
            message: 'User has already attendance for the day',
            duration: 2000,
            position: 'bottom'
          });
          toast.present();
          toast.onDidDismiss().then(() => {
            this.navigate();
          });
        } else {
          this.submitDisabled = false;
          console.log(" submitted false");
        }
      } else {
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
    if (this.isWeekend = (dayOfWeek === 0 || dayOfWeek === 6)) {
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
    } else {
      console.log("you can do entry today");
      this.isWeekend = false;
    }

  }

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

  // onPunchIn() {
  //   this.api.addAttendance(this.data,2)
  //     .then(async response => {
  //       this.api.showLoader();
  //       this.getCurrentCoordinates();
  //       console.log('added successfully:', response);
  //       this.api.EmployeeId = JSON.parse(response.data)
  //       this.api.EmployeeId = this.api.EmployeeId['Result']
  //       console.log(this.api.EmployeeId)
  //       const toast = await this.toastController.create({
  //         message: 'You have attendance successfully!',
  //         duration: 2000,
  //         position: 'bottom'
  //       });
  //       toast.present();
  //       toast.onDidDismiss().then(() => {
  //         this.api.hideLoader();
  //       });
  //     })
  //     .catch(error => {
  //       console.error('Error adding user:', error);
  //     });
  //   this.isPunchedIn = true;

  // }
  onPunchIn() {
    this.api.showLoader();
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp);
      this.data.InLatitude = resp.coords.latitude;
      this.data.InLongitude = resp.coords.longitude;

      this.api.addAttendance(this.data, 12)
        .then(async response => {
          console.log('added successfully:', response);
          this.api.EmployeeId = JSON.parse(response.data)
          this.api.EmployeeId = this.api.EmployeeId['Result']
          console.log(this.api.EmployeeId)
          const toast = await this.toastController.create({
            message: 'You have attendance successfully!',
            duration: 2000,
            position: 'bottom'
          });
          toast.present();
          toast.onDidDismiss().then(() => {
            this.api.hideLoader();
          });
        })
        .catch(error => {
          console.error('Error adding user:', error);
          // Handle error response from API
          // ...
        })
        .finally(() => {
          this.api.hideLoader();
        });
      this.isPunchedIn = true;
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  // onPunchOut() {
  //   this.api.updateAttedance(this.data, 9)
  //     .then(async response => {
  //       this.api.showLoader();
  //       console.log('updated successfully:', response);
  //       this.dataJson = JSON.parse(response.data);
  //       console.log(this.dataJson);
  //       this.data = this.dataJson['Result'];
  //       console.log(this.data);
  //       const toast = await this.toastController.create({
  //         message: 'You have attendance successfully!',
  //         duration: 2000,
  //         position: 'bottom'
  //       });
  //       toast.present();
  //       toast.onDidDismiss().then(() => {
  //         this.navigate();
  //         this.api.hideLoader();
  //       });
  //     })
  //     .catch(async error => {
  //       console.error('Error updating data:', error);
  //       const toast = await this.toastController.create({
  //         message: 'Error updating attendance data. Please try again later.',
  //         duration: 2000,
  //         position: 'bottom'
  //       });
  //       toast.present();
  //     });
  //   this.isPunchedIn = false;
  // }
  onPunchOut(){
    this.api.showLoader();
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp);
      this.data.OutLatitude = resp.coords.latitude;
      this.data.OutLongitude = resp.coords.longitude;
      this.api.updateAttedance(this.data, 12)
      .then(async response => {
        this.api.showLoader();
        console.log('updated successfully:', response);
        this.dataJson = JSON.parse(response.data);
        console.log(this.dataJson);
        this.data = this.dataJson['Result'];
        console.log(this.data);
        const toast = await this.toastController.create({
          message: 'You have Punch Out successfully!',
          duration: 2000,
          position: 'bottom'
        });
        toast.present();
        toast.onDidDismiss().then(() => {
          this.navigate();
          this.api.hideLoader();
        });
      })
      .catch(async error => {
        console.error('Error updating data:', error);
        const toast = await this.toastController.create({
          message: 'Error updating attendance data. Please try again later.',
          duration: 2000,
          position: 'bottom'
        })
        .finally(() => {
          this.api.hideLoader();
        });
      });
    this.isPunchedIn = false;
    })
  }

  ngOnInit() {

  }
}
