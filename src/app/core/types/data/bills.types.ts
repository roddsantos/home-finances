import { CategoryObjectType } from "./category.types";
import { CompanyObjectType } from "./company.type";
import { BankObjectType } from "./bank.types";
import { CreditCardObjectType } from "./credit-card.types";
import { FetchPaginatedData } from "../services";

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

export type BillCreateType = {
    name: string;
    description: string;
    total: number;
    totalParcel: number;
    settled: boolean;
    parcels: number;
    due: Date;
    paid: Date | null;
    type: string;
    categoryId: string;
    bank1Id: string | null;
    bank2Id: string | null;
    isPayment: boolean;
    companyId: string | null;
    creditCardId: string | null;
    taxes: number;
    delta: number;
    isRecurrent: boolean;
};

export type BillUpdateType = Partial<BillCreateType> & {
    id: string;
};

export type BillDataObjectType = BillObjectType & {
    category: CategoryObjectType;
    creditCard: CreditCardObjectType | null;
    bank1: BankObjectType | null;
    bank2: BankObjectType | null;
    company: CompanyObjectType | null;
};

export type BillsIncomeMetadataType = {
    income: {
        count: number;
        total: number;
    };
};

export type BillsMetadataType = FetchPaginatedData<BillDataObjectType> &
    BillsIncomeMetadataType;
