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

export type ThemeType = "default" | "dark" | "binary";

export type RoutesType =
    | "/settings"
    | "/credit-cards"
    | "/companies"
    | "/banks"
    | "/categories"
    | "/bills"
    | "/dashboard"
    | "/";

export type RouteItemType = {
    page: RoutesType;
    icon: string;
    title: string;
    actions: boolean;
};
