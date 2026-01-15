import { ToggleButtonItemsType } from "src/app/core/types/components/toggle-buttons";
import { PaymentTypesObject } from "src/app/core/types/data/bills.types";

export const GENERAL_FORM = {
    noName: "you must enter a name",
    noDescription: "you must enter a description",
    yearOutOfRange: "year must be between 2023 and 2090",
    invalidTotal: "invalid total value",
    invalidValue: "invalid value",
};

export const COMPANY_FORM = {
    noCompany: "you must select a company",
    unnecessaryCreditCard: "credit card not allowed when bank is selected",
    unnecessaryBank: "bank not allowed when credit card is selected",
    invalidParcels: "invalid number of parcels",
};

export const CATEGORY_FORM = {
    noCategory: "you must select a category",
    noIcon: "you must enter an icon",
};

export const BANK_FORM = {
    noBank: "you must select a bank",
    noSavings: "you must enter a valid saving number",
    sameBanks: "banks cannot be the same",
};

export const CREDIT_CARD_FORM = {
    noCreditCard: "you must select a credit card",
    invalidClosingDay: "closing day needs to be a valid number",
    invalidDueDay: "due day needs to be a valid number",
    invalidParcels: "invalid number of parcels",
    noFlag: "flag must be picked",
    invalidLimit: "limit must be greater than zero",
};

export const BOOLEAN_FORM: ToggleButtonItemsType<boolean>[] = [
    { label: "yes", value: true },
    { label: "no", value: false },
];

export const MONEY_FLOW_FORM: ToggleButtonItemsType<boolean>[] = [
    { label: "outcome", value: true },
    { label: "income", value: false },
];

export const PAYMENT_TYPES: PaymentTypesObject[] = [
    {
        id: "money",
        name: "money",
        icon: "payments",
        description:
            "money income or outcome, who can be PIX transations, federal taxes, job payment etc.",
    },
    {
        id: "creditCard",
        name: "credit card",
        icon: "credit_card",
        description:
            "bill to be deduced in some credit card - it can be a 1x or Nx payment",
    },
    {
        id: "companyCredit",
        name: "company credit",
        icon: "local_mall",
        description:
            "bill to be deduced either in a credit card or a bank account - not deduced immediatelly",
    },
];
