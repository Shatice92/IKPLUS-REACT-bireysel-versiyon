export interface IDefinitions {
    id: number;
    leavesName: TypeLeaves;
}

export enum TypeLeaves {
    ANNUAL_LEAVE = "Yıllık İzin",
    SICK_LEAVE = "Sağlık İzni",
    MATERNITY_LEAVE = "Kadın Doğum İzni",
    PATERNITY_LEAVE = "Erkek Doğum İzni",
    MARRIAGE_LEAVE = "Evlilik İzni",
    BEREAVEMENT_LEAVE = "Vefat İzni",
    COMPENSATORY_LEAVE = "Fazla Mesai İzni",
    UNPAID_LEAVE = "Ücretsiz İzin",
    STUDY_LEAVE = "Mesleki Eğitim İzni",
    PUBLIC_HOLIDAY = "Ulusal İzin",
    RELIGIOUS_HOLIDAY = "Dini Bayram İzni",
    EMERGENCY_LEAVE = "Acil Durum İzni",
    VOTING_LEAVE = "Seçim İzni",
    MILITARY_LEAVE = "Askerlik İzni",
    MEDICAL_LEAVE = "Tedavi İzni",
    ADOPTION_LEAVE = "Evlat Edinme İzni",
    SPECIAL_OCCASION_LEAVE = "Özel Gün İzni",
    QUARANTINE_LEAVE = "Karantina İzni",
    WORK_FROM_HOME = "Evden Çalışma İzni"
}



