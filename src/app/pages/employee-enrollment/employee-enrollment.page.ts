import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/Model/employee-details';
import { HTTP } from '@ionic-native/http/ngx';
import { ApiServicesService } from 'src/app/Services/api-services.service';
import { Platform } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';




@Component({
  selector: 'app-employee-enrollment',
  templateUrl: './employee-enrollment.page.html',
  styleUrls: ['./employee-enrollment.page.scss'],
})
export class EmployeeEnrollmentPage implements OnInit {

  employeeList:Employee[]=[];
  employeeListJson:string |any;
  PageNumber=1;
  EmployeeId:number |any;

  
  constructor(
    private api: ApiServicesService,
    private http:HTTP,
    private plt:Platform,
    private loadingController: LoadingController,
    private router: Router
  ) {
    
   }
  ngOnInit() {
    this.plt.ready().then((readySource: any) => {
      console.log('Platform ready from', readySource);
      this.api.showLoader()
      this.api.getEmployess(this.PageNumber).subscribe((res:any)=>{
        console.log(res)
        this.employeeListJson = JSON.parse(res);
        console.log(this.employeeListJson);
        this.employeeList = this.employeeListJson['Result'];   
        console.log(this.employeeList);
        //sirf ye lines add kiya hai
       
        
        // this.api.EmployeeId=  this.api.EmployeeId['EmployeeId']
        // console.log(this.api.EmployeeId)
        //  const ids = this.employeeList.map((employee: any) => employee.EmployeeId);
        //   console.log(ids);
        this.api.hideLoader();
        this.PageNumber++;
      })
    });

  //ye load karvaya tha direct only data 
    // this.plt.ready().then((readySource: any) => {
    //   console.log('Platform ready from', readySource);
    //   (this.api.getEmployess()).subscribe((res:any)  =>{
    //     this.employeeListJson = JSON.parse(res);
    //     console.log(this.employeeListJson);
    //     this.employeeList = this.employeeListJson['Result'];   
    //     console.log(this.employeeList);
    //   });
    // });sirf console karvaya and page number pass kiya 
    // this.plt.ready().then((readySource: any) => {
    //   console.log('Platform ready from', readySource);
    //   (this.api.getEmployess(this.PageNumber)).subscribe((res:any)  =>{
    //     console.log(res);
    //     this.employeeListJson = JSON.parse(res);
    //     console.log(this.employeeListJson);
    //     this.employeeList = this.employeeListJson['Result'];   
    //     console.log(this.employeeList);
    //   });
    // });
  } 

  onNavigate(EmployeeId: number) {
    this.router.navigate(['employee-details'],
  {
    queryParams:{
      id:EmployeeId
    }
  });
  }
//isse data console log me milta hai 
  // async loadData(loadMore=false) {
  //   if(loadMore){
  //     this.page=this.page+1;
  //   }
  //   this.api.showLoader();
  //   (this.api.getEmployess()).subscribe((res:any)  =>{
  //     console.log('result: ',res);
  //     this.employeeList=[...this.employeeList,...res];
  //     console.log(this.employeeList);
  //     this.api.hideLoader();
  //   });
      
  // }
  //json wala new ye hai ye wala use kar rahi thi  
  // async loadData(loadMore=false) {
  //   if(loadMore){
  //     this.page=this.page+1;
  //   }
  //   this.api.showLoader();
  //   (this.api.getEmployess()).subscribe((res:any)  =>{
  //     this.employeeListJson = JSON.parse(res);
  //     console.log(this.employeeListJson);
  //     this.employeeList = this.employeeListJson['Result'];   
  //     console.log(this.employeeList);
  //     this.api.hideLoader();
  //   });
      
  // }
}
