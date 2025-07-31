import { ToggleButtonItemsType } from "src/app/core/types/components/toggle-buttons";

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

export const BANK_TYPES: ToggleButtonItemsType<boolean>[] = [
    { label: "income/outcome", value: false },
    { label: "between accounts", value: true },
];
