import { MonthBillsType } from "./subjects/dashboard.subjects";

export type ListStatus = "data" | "empty" | "error" | "loading";

export type ManagerTabs = "0" | "1" | "2" | "3";

export type MonthType = {
    name: string;
    order: number;
    short: string;
};

export type DateType = "mmYY" | "mmmmYYYY" | "mmmYY" | "ddMMyyyy";

export type PaymentTypes = "creditCard" | "money" | "companyCredit";

export type PaymentTypesObject = {
    name: string;
    icon: string;
    id: PaymentTypes;
    description: string;
};

export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];
export type OptionalKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

export type ThemeObjectType = {
    title: string;
    id: string;
    description: string;
    "--primary": string;
    "--secondary": string;
    "--background": string;
    "--bh": string;
    "--text-1": string;
    "--text-2": string;
    "--border-color": string;
    "--border-width": number;
    "--border-radius": number;
    "--error": string;
    "--warning": string;
    "--info": string;
    "--success": string;
    "--default": string;
    "--credit-card": string;
    "--bank": string;
    "--company": string;
    "--category": string;
    "--bill": string;
    "--disabled": string;
};

export type RoutesType =
    | "/settings"
    | "/credit-cards"
    | "/companies"
    | "/banks"
    | "/categories"
    | "/bills"
    | "/dashboard"
    | "/"
    | "/login"
    | "";

export type RouteItemActionType = {
    icons: string[];
    title: string;
    event: string;
};

export type RouteItemType = {
    page: RoutesType;
    icon: string;
    title: string;
    actions: RouteItemActionType[];
};

export type DateObject = {
    day: number;
    weekDay: number;
    thisMonth: boolean;
    thisYear: boolean;
    events: MonthBillsType;
};
