export type UserObject = {
    name: string;
    surname: string;
    username: string;
};

export type CompanyObject = {
    name: string;
    description: string;
    color: string;
    userId: string;
};

export type CreditCardObject = {
    name: string;
    description: string;
    color: string;
    month: string;
    year: number;
    isClosed: boolean;
    userId: string;
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
    parcels?: number;
    taxes: number;
    delta: number;
    due?: Date;
    month: string;
    year: number;
    companyId?: string;
    typeBillId?: string;
    bank1Id?: string;
    bank2Id?: string;
    creditCardId?: string;
    userId: string;
};
