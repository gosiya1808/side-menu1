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
  isLocation?:boolean;

  officeLocation = {
    latitude: 21.182448, // Latitude of the office location
    longitude: 72.808102 // Longitude of the office location
  };
  
  // attendanceLocation = {
  //   latitude: 21.215094, // Latitude of the attendance location
  //   longitude: 72.795231 // Longitude of the attendance location
  // };


 distanceThreshold = 0.05;
 
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
    this.getLocation();
  }

  ionViewDidLeave() {
    this.cameraPreview.stopCamera().then(() => {
      console.log('Camera preview stopped successfully');
    }).catch(err => {
      console.error('Failed to stop camera preview', err);
    });
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const earthRadius = 6371; // Radius of the Earth in kilometers
  
    // Convert latitude and longitude to radians
    const lat1Rad = this.degreesToRadians(lat1);
    const lon1Rad = this.degreesToRadians(lon1);
    const lat2Rad = this.degreesToRadians(lat2);
    const lon2Rad = this.degreesToRadians(lon2);
  
    // Calculate the differences between the coordinates
    const latDiff = lat2Rad - lat1Rad;
    const lonDiff = lon2Rad - lon1Rad;
  
    // Apply the Haversine formula
    const a = Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
  
    return distance; // Distance in kilometers
  }

  degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  getLocation() {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported');
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLat = position.coords.latitude;
        console.log(userLat)
        const userLon = position.coords.longitude;
        console.log(userLon)

        const distance = this.calculateDistance( this.officeLocation.latitude,
          this.officeLocation.longitude, userLat, userLon);

        if (distance <= this.distanceThreshold) {
         console.log("Permission Granted")
         this.isLocation = false // Permission granted for attendance
        } else {
         console.log("permission denied")
         this.isLocation = true
           const toast = await this.toastController.create({
             message: 'Sorry!! location not matched',
             duration: 2000,
             position: 'bottom'
           });
           toast.present();
           toast.onDidDismiss().then(() => {
             this.navigate();
           }); // Permission denied for attendance
        }
      },
      (error) => {
       console.log('Error getting user location: ' + error.message);
      }
    );
    }
    


  checkAttendanceStatus() {
    // this.api.showLoader();
    const employeeId = this.api.getEmployeeId();
    const today = new Date().toISOString().slice(0, 10);
    console.log(today);
    this.api.getAttendanceById(employeeId, today).then(async response => {
      const attendanceList = JSON.parse(response.data);
      console.log(attendanceList);
      this.details = attendanceList['Result'];
      console.log(this.details);

      //lat long dunctions
      // this.getLocation()
      // if (this.distance <= this.distanceThreshold) {
      //   console.log('Permission granted for attendance');
      //   this.isLocation = false
      //   // Perform attendance-related actions here
      // } else {
      //   console.log('Permission denied for attendance');
      //   this.isLocation = true
      //   const toast = await this.toastController.create({
      //     message: 'Sorry!! location not matched',
      //     duration: 2000,
      //     position: 'bottom'
      //   });
      //   toast.present();
      //   toast.onDidDismiss().then(() => {
      //     this.navigate();
      //   });
      //   // Optionally, display a message or take appropriate actions
      // }
      
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
            // this.api.hideLoader();
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
        // this.api.hideLoader();
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
    this.router.navigate(['/menu/home'])
    this.api.hideLoader();
  }
  async dismiss() {
    return await this.modalCtrl.dismiss();
  }
  getCurrentCoordinates() {
    // this.api.showLoader();
    this.geolocation.getCurrentPosition().then((resp:any) => {
      console.log(resp)
      this.data.InLatitude = resp.coords.latitude;
      this.data.InLongitude = resp.coords.longitude;
      // this.api.hideLoader();
    }).catch((error:any) => {
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
      //  debugger
      this.api.addAttendance(this.data, this.api.getEmployeeId()).then(async (res: any) => {
        console.log(res)
        if (res) {
          console.log('added successfully');
          const toast = await this.toastController.create({
            message: 'You have attendance successfully!',
            duration: 2000,
            position: 'bottom'
          });
          toast.present();
          toast.onDidDismiss().then(() => {
            this.api.hideLoader();
          });
        }
      })
      // if (this.api.addAttendance(this.data, this.api.getEmployeeId())) {
      //   console.log('added successfully');
      //   const toast = await this.toastController.create({
      //     message: 'You have attendance successfully!',
      //     duration: 2000,
      //     position: 'bottom'
      //   });
      //   toast.present();
      //   toast.onDidDismiss().then(() => {
      //     this.api.hideLoader();
      //   });
      // }
      this.isPunchedIn = true;
    })
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
    this.geolocation.getCurrentPosition().then(async (resp) => {
      console.log(resp);
      this.data.OutLatitude = resp.coords.latitude;
      this.data.OutLongitude = resp.coords.longitude;
      this.api.updateAttedance(this.data, this.api.getEmployeeId()).then(async (res: any) => {
        console.log(res)
        if (res) {
          console.log('updated successfully');
          const toast = await this.toastController.create({
            message: 'You have attendance successfully!',
            duration: 2000,
            position: 'bottom'
          });
          toast.present();
          toast.onDidDismiss().then(() => {
            this.navigate();
          });
        }
      })
      this.isPunchedIn = false;
    })
  }
  //camera preview

  requestCameraPermission() {
    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
      .then(result => {
        if (result.hasPermission) {
          this.startCamera();
        } else {
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
    this.api.showLoader()
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
      this.api.uploadImage(formData).then(async (res: any) => {
        console.log(res)
        this.detailsJson = JSON.parse(res.data);
        console.log(this.detailsJson);
        this.detailsJson = this.detailsJson['Result'];
        console.log(this.detailsJson);
        // let dummy = this.detailsJson['Result']
        // console.log(dummy);
        this.api.setImagefilename(this.detailsJson['FileName'])//added this
        this.api.setImagefilepath(this.detailsJson['FilePath'])

        const toast = await this.toastController.create({
          message: 'User has captured image succesfully',
          duration: 2000,
          position: 'bottom'
        });
        toast.present();
        toast.onDidDismiss().then(() => {
          this.api.hideLoader()
        });
        this.cameraPreview.stopCamera().then(() => {
          console.log('Camera preview stopped successfully');
          
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

  ngOnInit() {

  }
}
