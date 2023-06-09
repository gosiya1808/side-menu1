import { Time } from "@angular/common";

export class EmployeeDetails {
   
}


export class Employee{
    EmployeeId!: number;
    FirstName!: string;
    LastName!: string;
    Email!: string;
    Password!: string;
    JoiningDate!: Date;
    PhoneNumber!: string;
    AlternatePhoneNumber!: string;
    DepartmentId!: number;
    DesignationId!: number;
    ReportingEmployeeId!: number;
    ProfileImageName!: string;
    BirthDate!: string;
    Gender!: string;
    TemporaryAddress!: string;
    PermanentAddress!: string;
    Pincode!: number;
    InstitutionName!: string;
    CourseName!: string;
    CourseStartDate!: Date;
    CourseEndDate!: Date;
    Degree!: string;
    Grade!: string;
    ExperienceTypeId!: number;
    CompanyName!: string;
    LastJobLocation!: string;
    JobPosition!: string;
    FromPeriod!: Date;
    ToPeriod!: Date;
    EntryBy!: number;
    EntryDate!: Date;
    UpdateBy!: number;
    UpdatedDate!: Date;
    IsActive!: string;

   
}


export class Department{
    DepartmentId!: number;
    DepartmentName!: string;
    EntryBy!: number;
    EntryDate!: Date;
    UpdateBy!: number;
    UpdatedDate!: Date;
    IsActive!: string;
}

export class Designation{
    DesignationId!: number;
    DesignationName!: string;
    EntryBy!: number;
    EntryDate!: Date;
    UpdateBy!: number;
    UpdatedDate!: Date;
    IsActive!: string;
}

export class Attendance{
    AttendanceId! : number;
    EmployeeId! : number;
    Date! : string;
    InTime! : string;
    OutTime! : string;
    InLatitude! : number;
    OutLatitude! :number;
    InLongitude! :number;
    OutLongitude! :number;
    Entryby! : number;
    EntryDate! : Date;
    UpdatedBy! : number;
    UpdatedDate! : Date;
    IsActive! : string;
    InDiscription! : string;
    OutDiscription! : string;
    status!: string;
}

export class UserAuth{
    UserName!:string;
    UserPassword!:string;
    RememberMe!:boolean;
    role!: string;
   
}

export class ProgressData {
    punchInTime!: string;
    elapsed!: number;
   totalDuration!: number;
    // Other properties as needed
  }