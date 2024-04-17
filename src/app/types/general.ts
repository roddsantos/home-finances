export type ListStatus = "data" | "empty" | "error" | "loading";

export type ManagerTabs = "0" | "1" | "2" | "3";

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
};
