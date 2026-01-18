import { CreditCardObjectType } from "./data/credit-card.types";

export type CompanyObject = {
    name: string;
    description: string;
    color: string;
};

export type FetchPaginatedData<T = any> = {
    count: number;
    data: T[];
    total?: number;
};

export type AllSettledHttpConnection = {
    status: "fulfilled" | "rejected";
    value?: any;
    error?: any;
};

export type SumAndCountData = {
    total: number;
    count: number;
};

export type CreditCardDashboardType = {
    [name: string]: {
        [month: number]: CreditCardObjectType | null;
    };
};
