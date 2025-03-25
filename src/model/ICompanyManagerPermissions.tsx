import { LeaveStatus } from "./IPermissions";

export interface ICompanyManagerPermissions {
    id : number;
    employeeName: string;
    startDate: string;
    endDate: string;
    leaveTypeId: number;
    employeeId: number;
    leaveTypeName?: string;
    status: LeaveStatus;
    
}



  



