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

export type Category = {
    id: string;
    name: string;
    description: string;
    icon: string;
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
    type: string;
    companyId: string;
    categoryId: string;
    bank1Id: string;
    bank2Id: string;
    creditCardId: string;
    userId: string;
    updatedAt: string;
    createdAt: string;
    deletedAt: string | null;
    totalParcel: number | null;
};

export type BillData = {
    category: Category;
    creditCard: CreditCard | null;
    bank1: Bank | null;
    bank2: Bank | null;
    company: Company | null;
};
