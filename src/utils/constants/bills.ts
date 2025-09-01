import { CustomTabType } from "src/app/core/types/components/tabs";
import { ToggleButtonItemsType } from "src/app/core/types/components/toggle-buttons";

export const TYPE_ITEMS: ToggleButtonItemsType<string>[] = [
    { label: "all", value: "all" },
    { label: "money", value: "money" },
    { label: "credit", value: "money" },
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

const EDIT_MONEY_BILLS_TABS: CustomTabType[] = [
    { title: "main info", icons: ["info"], index: 0 },
    { title: "bank info", icons: ["account_balance"], index: 1 },
    { title: "configs", icons: ["build"], index: 2 },
];

const EDIT_CREDIT_CARD_BILLS_TABS: CustomTabType[] = [
    { title: "main info", icons: ["info"], index: 0 },
    { title: "bank info", icons: ["credit_card"], index: 1 },
    { title: "configs", icons: ["build"], index: 2 },
];

const EDIT_COMPANY_BILLS_TABS: CustomTabType[] = [
    { title: "main info", icons: ["info"], index: 0 },
    { title: "bank info", icons: ["store"], index: 1 },
    { title: "configs", icons: ["build"], index: 2 },
];

export const EDIT_BILLS_TABS = {
    money: EDIT_MONEY_BILLS_TABS,
    creditCard: EDIT_CREDIT_CARD_BILLS_TABS,
    companyCredit: EDIT_COMPANY_BILLS_TABS,
};
