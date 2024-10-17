import { PaymentTypesObject } from "src/app/core/types/general";

export const NO_BANK = "you must select a bank";
export const NO_CREDIT_CARD = "you must select a credit card";
export const NO_COMPANY = "you must select a company";
export const NO_CATEGORY = "you must select a category";
export const NO_BILL_VALUE = "you must enter a valid bill value";
export const NEGATIVE_TOTAL = "total can't be negative when both banks choosed";
export const INVALID_PARCEL = "invalid number of parcels";
export const UNNECESSARY_BANK = "bank not allowed when credit card is selected";
export const UNNECESSARY_CC = "credit card not allowed when bank is selected";
export const SAME_BANK = "banks cannot be the same";

export const NO_NAME = "you must enter a name";
export const NO_DESCRIPTION = "you must enter a description";
export const YEAR_OUT_OF_RANGE = "year must be between 2023 and 2090";

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
