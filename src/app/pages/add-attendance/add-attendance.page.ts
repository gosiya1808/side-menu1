import { Component, OnInit } from '@angular/core';
import { Attendance, Employee } from 'src/app/Model/employee-details';
import { ModalController } from '@ionic/angular';
import { Data, Router } from '@angular/router';
import { ApiServicesService } from 'src/app/Services/api-services.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ToastController } from '@ionic/angular';
import { CameraPreview } from '@ionic-native/camera-preview/ngx'; // Import CameraPreview module
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { File } from '@ionic-native/file/ngx';


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
  detailsJson!: any;

  constructor(
    private api: ApiServicesService,
    public modalCtrl: ModalController,
    private router: Router,
    private geolocation: Geolocation,
    private toastController: ToastController,
    private cameraPreview: CameraPreview,
    private androidPermissions: AndroidPermissions,
    private file: File
  ) {
    // this.getCurrentCoordinatesPunchOut();
  }

  async ionViewDidEnter() {
    await this.checkAttendanceStatus();
    this.checkWeekend();
    this.startCamera();
  }

  ionViewDidLeave() {
    this.cameraPreview.stopCamera().then(() => {
      console.log('Camera preview stopped successfully');
    }).catch(err => {
      console.error('Failed to stop camera preview', err);
    });
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

  //i changes only EmployeeID = 36
  checkAttendanceStatus() {
    const employeeId = this.api.getEmployeeId();
    const today = new Date().toISOString().slice(0, 10);
    console.log(today);
    this.api.showLoader();
    this.api.getAttendanceById(employeeId, today).then(async response => {
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
  async onPunchIn() {
    this.api.showLoader();
    this.geolocation.getCurrentPosition().then(async (resp) => {
      console.log(resp);
      this.data.InLatitude = resp.coords.latitude;
      this.data.InLongitude = resp.coords.longitude;
      // this.captureImage();
      await this.api.addAttendance(this.data,this.api.getEmployeeId())
        .then(async response => {
          console.log('added successfully:', response);
          this.api.EmployeeId = JSON.parse(response.data)
          this.api.EmployeeId = this.api.EmployeeId['Result']
          console.log(this.api.EmployeeId)

          //here is the image upload api
          await this.api.imageWithattendance(this.api.getEmployeeId(),
            "0d9ea527-3c88-4849-900f-d3a519e5a2fc",
            "F:\\Project\\HRMS_Project\\MVCProject.Api\\Attachments\\Attendance\\0d9ea527-3c88-4849-900f-d3a519e5a2fc")
            .then(response => {
              console.log('image uploaded successfully:', response);
              // Handle success response from imageWithattendance() API
              // ...
            })
            .catch(error => {
              console.error('Error uploading image:', error);
              // Handle error response from imageWithattendance() API
              // ...
            });
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

  onPunchOut() {
    this.api.showLoader();
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp);
      this.data.OutLatitude = resp.coords.latitude;
      this.data.OutLongitude = resp.coords.longitude;
      this.api.updateAttedance(this.data, this.api.getEmployeeId())//36 ki jagah pe ye copy kiya
        .then(async response => {
          this.api.showLoader();
          console.log('updated successfully:', response);
          this.dataJson = JSON.parse(response.data);
          console.log(this.dataJson);
          this.data = this.dataJson['Result'];
          console.log(this.data);
          await this.api.imageWithattendance(this.api.getEmployeeId(),
            "7ee0cc58-66fb-4e95-93b6-16e12b526ab3",
            "F:\\Project\\HRMS_Project\\MVCProject.Api\\Attachments\\Attendance\\7ee0cc58-66fb-4e95-93b6-16e12b526ab3")
            .then(response => {
              console.log('image uploaded successfully:', response);
              // Handle success response from imageWithattendance() API
              // ...
            })
            .catch(error => {
              console.error('Error uploading image:', error);
              // Handle error response from imageWithattendance() API
              // ...
            });
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
  //camera preview

  requestCameraPermission() {
    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
      .then(result => {
        if (result.hasPermission) {
          // Permission granted, start the camera preview
          this.startCamera();
        } else {
          // Permission denied, handle accordingly
          console.error('Camera permission denied');
        }
      })
      .catch(error => {
        console.error('Error requesting camera permission', error);
      });
  }

  startCamera() {
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    const cameraWidth = 300;
    const cameraHeight = 400;

    const cameraX = (screenWidth - cameraWidth) / 2;
    const cameraY = (screenHeight - cameraHeight) / 2 - (screenHeight * 0.1);

    let options = {
      x: cameraX,
      y: cameraY,
      width: cameraWidth,
      height: cameraHeight,
      toBack: false,
      tapPhoto: true,
      tapFocus: false,
      previewDrag: false,
      storeToFile: false,
      disableExifHeaderStripping: false
    };

    this.cameraPreview.startCamera(options).then(() => {
      console.log('Camera preview started successfully');
    }).catch(err => {
      console.error('Failed to start camera preview', err);
    });
  }

  // Function to capture and store image
  captureImage() {
    this.cameraPreview.takeSnapshot({ width: 640, height: 640, quality: 85 }).then(base64Data => {
      console.log('Start to capture the image ', base64Data);
      let imageData = 'data:image/jpeg;base64,' + base64Data;
      console.log(imageData)
      const byteCharacters = atob(imageData.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/jpeg" });
      const formData = new FormData
      formData.append('file', blob)
      this.api.showLoader()
      this.api.uploadImage(formData).then(async (res: any) => {
        console.log(res)
        this.detailsJson = JSON.parse(res.data);
        console.log(this.detailsJson);
        this.detailsJson = this.detailsJson['Result'];
        console.log(this.detailsJson);


        const toast = await this.toastController.create({
          message: 'User has captured image succesfully',
          duration: 2000,
          position: 'bottom'
        });
        toast.present();
        toast.onDidDismiss().then(() => {
          // this.navigate();
        });
        this.cameraPreview.stopCamera().then(() => {
          console.log('Camera preview stopped successfully');
          this.api.hideLoader()
        }).catch(err => {
          console.error('Failed to stop camera preview', err);
        });
      }).catch(err => {
        console.error('Failed to upload image', err);
      });
    }).catch(err => {
      console.error('Failed to capture image', err);
    });
  }

  // startCamera() {
  //   const screenWidth = window.screen.width;
  //   const screenHeight = window.screen.height;

  //   const cameraWidth = 300;
  //   const cameraHeight = 400;

  //   const cameraX = (screenWidth - cameraWidth) / 2;

  //   const cameraY = (screenHeight - cameraHeight) / 2 - (screenHeight * 0.1);

  //   let options = {
  //     x: cameraX,
  //     y: cameraY,
  //     width: cameraWidth,
  //     height: cameraHeight,
  //     // camera: this.cameraPreview.CAMERA_DIRECTION.BACK,
  //     toBack: false,
  //     tapPhoto: true,
  //     tapFocus: false,
  //     previewDrag: false,
  //     storeToFile: false,
  //     disableExifHeaderStripping: false
  //   };


  //   this.cameraPreview.startCamera(options).then(() => {
  //     console.log('Camera preview started successfully');

  //     // Capture an image
  //     // setTimeout(() => kjjhjh{
  //       this.cameraPreview.takeSnapshot({ width: 640, height: 640, quality: 85 }).then(base64Data => {
  //         // Process the captured image data
  //         // ...
  //         console.log('Start to capture the image ', base64Data);

  //         let dummy = base64Data[0]


  //         let imageData = 'data:image/jpeg;base64,' + base64Data;
  //         console.log(imageData)

  //         const byteCharacters = atob(imageData.split(',')[1]);
  //         const byteNumbers = new Array(byteCharacters.length);
  //         for (let i = 0; i < byteCharacters.length; i++) {
  //           byteNumbers[i] = byteCharacters.charCodeAt(i);
  //         }
  //         const byteArray = new Uint8Array(byteNumbers);
  //         const blob = new Blob([byteArray], { type: "image/jpeg" });
  //         const formData = new FormData
  //         formData.append('file', blob)
  //         this.api.uploadImage(formData).then(res => {
  //           console.log(res)
  //         })
  //         // Stop the camera preview
  //         this.cameraPreview.stopCamera().then(() => {
  //           console.log('Camera preview stopped successfully');
  //         }).catch(err => {
  //           console.error('Failed to stop camera preview', err);
  //         });
  //       }).catch(err => {
  //         console.error('Failed to capture image', err);
  //         this.cameraPreview.stopCamera().then(() => {
  //           console.log('Camera preview stopped successfully');
  //         }).catch(err => {
  //           console.error('Failed to stop camera preview', err);
  //         });
  //       });
  //     //  }, 10000);
  //   }).catch(err => {
  //     console.error('Failed to start camera preview', err);
  //   });
  // }

  ngOnInit() {

  }
}
