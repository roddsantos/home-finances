export type ListStatus = "data" | "empty" | "error" | "loading";

export type ManagerTabs = "0" | "1" | "2" | "3";

export type MonthType = {
    name: string;
    order: number;
    short: string;
};

export type DateType = "mmYY" | "mmmmYYYY" | "mmmYY" | "ddMMyyyy";

export type PaymentTypes = "creditCard" | "money" | "companyCredit";
