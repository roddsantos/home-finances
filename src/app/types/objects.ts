export type User = {
    id: string;
    name: string;
    surname: string;
    username: string;
    updatedAt: string;
    createdAt: string;
    deletedAt: string | null;
};

export type Company = {
    id: string;
    name: string;
    description: string;
    color: string;
    userId: string;
    updatedAt: string;
    createdAt: string;
    deletedAt: string | null;
};

export type CreditCard = {
    id: string;
    name: string;
    description: string;
    color: string;
    limit: number;
    month: string;
    year: number;
    isClosed: boolean;
    userId: string;
    updatedAt: string;
    createdAt: string;
    deletedAt: string | null;
};

export type TypeBill = {
    id: string;
    name: string;
    description: string;
    icon: string;
    referTo: string;
    updatedAt: string;
    createdAt: string;
    deletedAt: string | null;
};

export type Bank = {
    id: string;
    name: string;
    description: string;
    color: string;
    savings: number;
    userId: string;
    updatedAt: string;
    createdAt: string;
    deletedAt: string | null;
};

export type Bill = {
    id: string;
    name: string;
    description: string;
    total: number;
    settled: boolean;
    parcels: number;
    taxes: number;
    delta: number;
    due: Date;
    month: number;
    year: number;
    companyId: string;
    typeBillId: string;
    bank1Id: string;
    bank2Id: string;
    creditCardId: string;
    userId: string;
    updatedAt: string;
    createdAt: string;
    deletedAt: string | null;
};

export type BillData = {
    typeBill: TypeBill;
    creditCard: CreditCard | null;
    bank1: Bank | null;
    bank2: Bank | null;
    company: Company | null;
};
