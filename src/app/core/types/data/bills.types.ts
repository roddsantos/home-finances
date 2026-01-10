import { CategoryObjectType } from "./category.types";
import { Bank, CreditCard } from "../objects";
import { CompanyObjectType } from "./company.type";

export type BillObjectType = {
    id: string;
    groupId: string;
    name: string;
    description: string;
    total: number;
    totalParcel: number;
    settled: boolean;
    parcels: number;
    parcel: number;
    taxes: number;
    delta: number;
    due: Date;
    paid: Date | null;
    type: string;
    companyId: string;
    categoryId: string;
    bank1Id: string;
    bank2Id: string;
    isRecurrent: boolean;
    creditCardId: string;
    isPayment: boolean;
    userId: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
};

export type BillDataObjectType = BillObjectType & {
    category: CategoryObjectType;
    creditCard: CreditCard | null;
    bank1: Bank | null;
    bank2: Bank | null;
    company: CompanyObjectType | null;
};
