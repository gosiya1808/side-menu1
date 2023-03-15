import { Component, OnInit } from '@angular/core';
import { ApiServicesService } from 'src/app/Services/api-services.service';



@Component({
  selector: 'app-department',
  templateUrl: './department.page.html',
  styleUrls: ['./department.page.scss'],
})
export class DepartmentPage implements OnInit {
  listdata:any[]=[]; 
  // dump:any[] = new Department[];
  
  constructor(

    private api:ApiServicesService,
  ) { }

  // async getDepartments(){
  //  (await this.api.getDepartment()).then((res:any) => {
  //     console.log('result: ',res);
  //     this.listdata=[...this.listdata,...res];
  //     console.log(this.listdata);
  //   })
  // }

  ngOnInit() {
    
  }

}
