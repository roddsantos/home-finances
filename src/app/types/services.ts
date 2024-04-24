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
    typeBillId: string;
    due?: Date;
    month: number;
    year: number;
};

export type BillObjectBank = {
    bank1Id: string;
    bank2Id?: string;
    isPayment: boolean;
};

export type BillObjectCompany = {
    companyId: string;
    bank1Id: string;
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

export type BillObjectService = {
    creditCardId?: string;
    companyId: string;
    bank1Id?: string;
    parcels: number;
    taxes?: number;
    delta?: number;
};

export type GetCreditCard = {
    month?: string;
    year?: number;
    isClosed?: boolean;
    page: number;
    limit: number;
};

export type GetBillsFilter = {
    page: number;
    limit: number;
    typeBillId?: string;
    month?: string;
    year?: number;
    settled?: boolean;
};
