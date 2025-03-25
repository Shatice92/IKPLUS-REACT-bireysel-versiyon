export interface IEmployee {
    id: number;
    firstName: string;
    lastName: string;
    hireDate: string;
    status: EmployeeStatus;
    position: string;
    
}

export enum EmployeeStatus {
    ACTIVE = "ACTIVE",
    PASSIVE = "PASSIVE",
    
}