import { PaymentTypes } from "./general";

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
    limitLeft: number;
    flag: string;
    day: number;
    due: number;
    month: number;
    year: number;
    isClosed: boolean;
    userId: string;
    invoice: number;
    updatedAt: string;
    createdAt: string;
    deletedAt: string | null;
};

export type Category = {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    userId: string;
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
    due: string;
    paid: string;
    month: number;
    year: number;
    type: PaymentTypes;
    companyId: string;
    categoryId: string;
    bank1Id: string;
    bank2Id: string;
    isPayment: boolean;
    creditCardId: string;
    isRefund: boolean;
    userId: string;
    updatedAt: string;
    createdAt: string;
    deletedAt: string | null;
    totalParcel: number | null;
    parcel: number;
};

export type BillData = {
    category: Category;
    creditCard: CreditCard | null;
    bank1: Bank | null;
    bank2: Bank | null;
    company: Company | null;
    groupId: string;
};

export type CrreditCardFlag = {
    name: string;
    id: string;
    icon: string;
};