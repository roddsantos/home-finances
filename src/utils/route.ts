import { RouteItemType } from "src/app/core/types/general";

export const ROUTES: RouteItemType[] = [
    {
        page: "/",
        title: "finances",
        icon: "cottage",
        actions: false,
    },
    {
        page: "/dashboard",
        title: "dashboard",
        icon: "pie_chart",
        actions: false,
    },
    {
        page: "/bills",
        title: "bills",
        icon: "calendar_month",
        actions: true,
    },
    {
        page: "/credit-cards",
        title: "credit cards",
        icon: "credit_card",
        actions: true,
    },
    {
        page: "/banks",
        title: "banks and savings",
        icon: "account_balance",
        actions: true,
    },
    {
        page: "/companies",
        title: "companies and brands",
        icon: "store",
        actions: true,
    },
    {
        page: "/categories",
        title: "categories",
        icon: "category",
        actions: true,
    },
    {
        page: "/settings",
        title: "settings",
        icon: "settings",
        actions: false,
    },
];
