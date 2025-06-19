import { ToggleButtonItemsType } from "src/app/core/types/components/toggle-buttons";

export const TYPE_ITEMS: ToggleButtonItemsType[] = [
    { label: "all", value: "all" },
    { label: "money", value: "money" },
    { label: "credit", value: "companyCredit" },
    { label: "credit card", value: "creditCard" },
];

export const STATUS_ITEMS: ToggleButtonItemsType[] = [
    { label: "all", value: "all" },
    { label: "pending", value: "pending" },
    { label: "settled", value: "settled" },
];
