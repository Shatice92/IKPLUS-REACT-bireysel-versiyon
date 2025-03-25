export interface IShiftManagement {
  id: number;
  startTime: string;
  endTime: string;
  employeeId: string;
  shiftType:SHIFTTYPE
}

export enum SHIFTTYPE {
  FULL_SHIFT = "FULL_SHIFT",
  HALF_SHIFT = "HALF_SHIFT",
  QUARTER_SHIFT = "QUARTER_SHIFT",  
  EIGHTH_SHIFT = "EIGHTH_SHIFT",
  NINTH_SHIFT= "NINTH_SHIFT",
}

