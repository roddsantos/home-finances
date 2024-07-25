import { PaymentTypes } from "./general";

export type UserObject = {
    name: string;
    surname: string;
    username: string;
};

export type CompanyObject = {
    name: string;
    description: string;
    color: string;
};

export type CreditCardObject = {
    name: string;
    description: string;
    color: string;
    month: number;
    year: number;
    isClosed: boolean;
};

export type CategoryObject = {
    name: string;
    description: string;
    color: string;
    icon: string;
};

export type BankObject = {
    name: string;
    description: string;
    color: string;
    savings: number;
    userId: string;
};

export type BillObject = {
    name: string;
    description: string;
    total: number;
    settled: boolean;
    type: PaymentTypes;
    categoryId: string;
    due: Date;
};

export type BillObjectBank = {
    bank1Id: string;
    bank2Id?: string;
    companyId?: string;
    isPayment: boolean;
};

export type BillObjectCompany = {
    companyId: string;
    bank1Id?: string;
    creditCardId?: string;
    parcels: number;
    taxes?: number;
    delta?: number;
};

export type BillObjectCredtCard = {
    creditCardId: string;
    companyId?: string;
    parcels: number;
    taxes?: number;
    delta?: number;
    isRefund: boolean;
};

export type BillObjectCredtCardUpdate = {
    totalParcel: number | null;
    parcel: number;
};

export type GetCreditCard = {
    month?: string;
    year?: number;
    isClosed?: boolean;
};

export type GetBillsFilter = {
    page: number;
    limit: number;
    months?: number[];
    min?: number;
    max?: number;
    year?: number;
    data?: string;
    status?: "all" | "pending" | "settled";
};

export type FetchPaginatedData<T = any> = {
    count: number;
    data: T[];
};

export type AllSettledHttpConnection = {
    status: "fulfilled" | "rejected";
    value?: any;
    error?: any;
};
