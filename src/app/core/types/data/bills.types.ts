import { CategoryObjectType } from "./category.types";
import { CompanyObjectType } from "./company.type";
import { BankObjectType } from "./bank.types";
import { CreditCardObjectType } from "./credit-card.types";

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
    creditCard: CreditCardObjectType | null;
    bank1: BankObjectType | null;
    bank2: BankObjectType | null;
    company: CompanyObjectType | null;
};
