import { CategoryObjectType } from "./category.types";
import { CompanyObjectType } from "./company.type";
import { BankObjectType } from "./bank.types";
import { CreditCardObjectType } from "./credit-card.types";
import { FetchPaginatedData } from "../services";

export type PaymentTypes = "creditCard" | "money" | "companyCredit";

export type PaymentTypesObject = {
    name: string;
    icon: string;
    id: PaymentTypes;
    description: string;
};

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
    type: PaymentTypes;
    companyId: string | null;
    categoryId: string;
    bank1Id: string | null;
    bank2Id: string | null;
    isRecurrent: boolean;
    creditCardId: string | null;
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
    type: PaymentTypes;
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

export type BillUpdateType = Partial<BillObjectType> & {
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

export type BillUpdateResponse = {
    banks: BankObjectType[];
    creditCard: CreditCardObjectType;
    bill: BillObjectType;
};

export type BillsMetadataSubjectType = {
    total: number;
    count: number;
    incomeTotal: number;
    incomeCount: number;
    outcomeTotal: number;
    outcomeCount: number;
};
