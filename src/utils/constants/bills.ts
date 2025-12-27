import { CustomTabType } from "src/app/core/types/components/tabs";
import {
    MonthYearToggleType,
    ToggleButtonItemsType,
} from "src/app/core/types/components/toggle-buttons";
import { getMonthAndYearIntegers } from "../date";

export const TYPE_ITEMS: ToggleButtonItemsType<string>[] = [
    { label: "all", value: "all" },
    { label: "money", value: "money" },
    { label: "credit", value: "companyCredit" },
    { label: "credit card", value: "creditCard" },
];

export const STATUS_ITEMS: ToggleButtonItemsType<string>[] = [
    { label: "all", value: "all" },
    { label: "pending", value: "pending" },
    { label: "settled", value: "settled" },
];

export const PAYMENT_ITEMS: ToggleButtonItemsType<string>[] = [
    { label: "all", value: "all" },
    { label: "income", value: "income" },
    { label: "outcome", value: "outcome" },
];

export const MONTH_ITEMS: ToggleButtonItemsType<MonthYearToggleType>[] = [
    {
        label: "this month",
        value: { ...getMonthAndYearIntegers(0) },
    },
    {
        label: "next month",
        value: { ...getMonthAndYearIntegers(1) },
    },
    {
        label: "prev month",
        value: { ...getMonthAndYearIntegers(-1) },
    },
];

export const BANK_TYPES: ToggleButtonItemsType<boolean>[] = [
    { label: "income/outcome", value: false },
    { label: "between accounts", value: true },
];

export const EDIT_BILLS_TABS: CustomTabType[] = [
    { title: "main info", icons: ["info"], index: 0 },
    { title: "payment info", icons: ["account_balance"], index: 1 },
    { title: "configs", icons: ["build"], index: 2 },
];

export const FILTER_TO_ICON = {
    name: "signature",
    category: "category",
    company: "store",
    creditcard: "credit_card",
    year: "calendar_month",
    month: "calendar_month",
    bank: "account_balance",
    type: "wallet",
    status: "paid",
    moneyflux: "payment_arrow_down",
    min: "receipt",
    max: "receipt",
    date1: "date_range",
    date2: "date_range",
};
