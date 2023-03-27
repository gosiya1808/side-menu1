  import { Component, OnInit } from '@angular/core';
  import { Attendance, Employee } from 'src/app/Model/employee-details';
  import { ModalController } from '@ionic/angular';
  import { Router } from '@angular/router';
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
    attendanceMarked : boolean = false;
    //detailsJson:string|any;
    
    constructor(
      private api:ApiServicesService,
      public modalCtrl: ModalController,
      private router:Router,
      private geolocation: Geolocation,
      private toastController: ToastController,
      private storage: Storage
    ) {
      // this.getCurrentCoordinates();
    }

    // async ionViewDidEnter(){
    //  await this.checkAttendanceStatus();//nahi work kare to nikal dena 
    // }

    async ionViewDidEnter() {
        await this.checkAttendanceStatus();
    }
    
    checkAttendanceStatus() {
      const EmployeeId = 7; // replace with the actual employee id
      this.api.getAttendanceById(EmployeeId).then(response => {
        const attendanceList = JSON.parse(response.data);
        console.log(attendanceList);
        this.details = attendanceList['Result'];
        console.log(this.details);  
        if (attendanceList && attendanceList['Result']) {
          this.attendanceMarked = true;
          console.log('attendance marked is true');
        }else {
          this.attendanceMarked = false;
          console.log('attendance marked is false');
        }
      }).catch(error => {
        console.error('Error fetching attendance:', error);
      });
    }

    onSubmit() {
      this.api.addAttendance(this.data,7)
        .then(async response => {
          console.log('added successfully:', response);
          this.api.EmployeeId=JSON.parse(response.data)
          this.api.EmployeeId=this.api.EmployeeId['Result']
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
            this.navigate();
          }, 2000);
        })
        .catch(error => {
          console.error('Error adding user:', error);
        });   
    }
    

    navigate(){
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

    ngOnInit() {
      
    }
  }
