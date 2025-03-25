export interface ICompany {
    id: number;
    name: string;
    applicationDate: string;
    companyManagerId: number;
    emailVerified: boolean;
    membershipPlan: string;
    address: string;
    phone: string;
    emailDomain: string;
    logo: string;
    status: CompanyStatus
    updatedAt: string;


}

export enum CompanyStatus {
    APPROVED = "APPROVED",
    PENDING = "PENDING",
    REJECTED = "REJECTED"
}


export const CompanyStatusLabels: Record<CompanyStatus, string> = {
    [CompanyStatus.APPROVED]: "Onaylandı",
    [CompanyStatus.PENDING]: "Onay İçin Bekliyor",
    [CompanyStatus.REJECTED]: "Reddedildi",
};