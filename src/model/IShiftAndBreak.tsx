export interface IShift {
    id: number;
    employeeId: number;
    companyManagerId: number;
    shiftType: ShiftType;
    startTime: string;
    endTime: string;

}

export interface IBreak {
    id: number;
    shiftId: number;
    employeeId: number;
    breakName: BreakName;
    startTime: string;
    endTime: string;
}



export enum ShiftType {
    FULL_SHIFT = "FULL_SHIFT",
    HALF_SHIFT = "HALF_SHIFT",
    QUARTER_SHIFT = "QUARTER_SHIFT",
    EIGHTH_SHIFT = "EIGHTH_SHIFT",
    NINTH_SHIFT = "NINTH_SHIFT",

}

export enum BreakName {
    LUNCH = "LUNCH",
    DINNER = "DINNER",
    CLEANING = "CLEANING",
    MEDICAL = "MEDICAL",
    OTHER = "OTHER",

}


// Ekranda görünen Türkçe karşılıklarını belirtiyoruz
export const ShiftTypeLabels: Record<ShiftType, string> = {
    [ShiftType.FULL_SHIFT]: "Tam Vardiya",
    [ShiftType.HALF_SHIFT]: "Yarım Vardiya",
    [ShiftType.QUARTER_SHIFT]: "Çeyrek Vardiya",
    [ShiftType.EIGHTH_SHIFT]: "Sekizlik Vardiya",
    [ShiftType.NINTH_SHIFT]: "Dokuzluk Vardiya",
};

export const BreakNameLabels: Record<BreakName, string> = {
    [BreakName.LUNCH]: "Öğle Molası",
    [BreakName.DINNER]: "Akşam Yemeği",
    [BreakName.CLEANING]: "Temizlik Molası",
    [BreakName.MEDICAL]: "Sağlık Molası",
    [BreakName.OTHER]: "Diğer",
};