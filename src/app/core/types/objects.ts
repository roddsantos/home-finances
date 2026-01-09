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

export type Bank = {
    id: string;
    name: string;
    description: string;
    color: string;
    savings: number;
    userId: string;
    isPiggyBank: boolean;
    updatedAt: string;
    createdAt: string;
    deletedAt: string | null;
};

export type CrreditCardFlag = {
    name: string;
    id: string;
    icon: string;
};

export type MonthlySavingsTypes = "start";

export type SavingsType = {
    id: string;
    bankId: string;
    total: number;
    month: number;
    year: number;
    type: MonthlySavingsTypes;
    updatedAt: string;
    createdAt: string;
    deletedAt: string | null;
};

export type DatabaseTrackType = {
    id: string;
    updatedAt: string;
    createdAt: string;
    deletedAt: string | null;
};
