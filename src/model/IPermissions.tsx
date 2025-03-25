export interface IPermissions {
  leaveTypeId: number;
  leaveTypeName?: string; // Yeni alan ekledik
  startDate: string;
  endDate: string;
  status: LeaveStatus;
}






export enum LeaveStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",

}


export const LeaveStatusLabels: Record<LeaveStatus, string> = {
  [LeaveStatus.PENDING]: "Beklemede",
  [LeaveStatus.APPROVED]: "Onaylandı",
  [LeaveStatus.REJECTED]: "Reddedildi",
};


export const leaveTypes: Record<string, string> = {
  "ANNUAL_LEAVE": "Yıllık İzin",
  "SICK_LEAVE": "Sağlık İzni",
  "MATERNITY_LEAVE": "Kadın Doğum İzni",
  "PATERNITY_LEAVE": "Erkek Doğum İzni",
  "MARRIAGE_LEAVE": "Evlilik İzni",
  "BEREAVEMENT_LEAVE": "Vefat İzni",
  "COMPENSATORY_LEAVE": "Fazla Mesai İzni",
  "UNPAID_LEAVE": "Ücretsiz İzin",
  "STUDY_LEAVE": "Mesleki Eğitim İzni",
  "PUBLIC_HOLIDAY": "Ulusal İzin",
  "RELIGIOUS_HOLIDAY": "Dini Bayram İzni",
  "EMERGENCY_LEAVE": "Acil Durum İzni",
  "VOTING_LEAVE": "Seçim İzni",
  "MILITARY_LEAVE": "Askerlik İzni",
  "MEDICAL_LEAVE": "Tedavi İzni",
  "ADOPTION_LEAVE": "Evlat Edinme İzni",
  "SPECIAL_OCCASION_LEAVE": "Özel Gün İzni",
  "QUARANTINE_LEAVE": "Karantina İzni",
  "WORK_FROM_HOME": "Evden Çalışma İzni"
};


export const leaveId: Record<number, string> = {
  2: "Yıllık İzin",
  3: "Sağlık İzni",
  4: "Kadın Doğum İzni",
  5: "Erkek Doğum İzni",
  6: "Evlilik İzni",
  7: "Vefat İzni",
  8: "Fazla Mesai İzni",
  9: "Ücretsiz İzin",
  10: "Mesleki Eğitim İzni",
  11: "Ulusal İzin",
  12: "Dini Bayram İzni",
  13: "Acil Durum İzni",
  14: "Seçim İzni",
  15: "Askerlik İzni",
  16: "Tedavi İzni",
  17: "Evlat Edinme İzni",
  18: "Özel Gün İzni",
  19: "Karantina İzni",
  20: "Evden Çalışma İzni"
};