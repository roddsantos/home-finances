import { RouteItemType } from "src/app/core/types/general";

export const ROUTES: RouteItemType[] = [
    {
        page: "/",
        title: "finances",
        icon: "cottage",
        actions: [],
    },
    {
        page: "/dashboard",
        title: "dashboard",
        icon: "pie_chart",
        actions: [],
    },
    {
        page: "/bills",
        title: "bills",
        icon: "receipt_long",
        actions: [
            {
                icons: ["add", "receipt_long"],
                title: "new bill",
                event: "creating",
            },
        ],
    },
    {
        page: "/credit-cards",
        title: "credit cards",
        icon: "credit_card",
        actions: [
            {
                icons: ["add", "credit_card"],
                title: "new credit card",
                event: "creating",
            },
        ],
    },
    {
        page: "/banks",
        title: "banks and savings",
        icon: "account_balance",
        actions: [
            {
                icons: ["add", "savings"],
                title: "set a saving",
                event: "saving",
            },
            {
                icons: ["add", "account_balance"],
                title: "new bank",
                event: "creating",
            },
        ],
    },
    {
        page: "/companies",
        title: "companies and brands",
        icon: "store",
        actions: [
            {
                icons: ["add", "store"],
                title: "new company / brand",
                event: "creating",
            },
        ],
    },
    {
        page: "/categories",
        title: "categories",
        icon: "category",
        actions: [
            {
                icons: ["add", "category"],
                title: "new category",
                event: "creating",
            },
        ],
    },
    {
        page: "/settings",
        title: "settings",
        icon: "settings",
        actions: [],
    },
];
