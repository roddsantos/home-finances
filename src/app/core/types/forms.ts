import { AbstractControl, ValidationErrors } from "@angular/forms";
import { PaymentTypes } from "./general";
import { CategoryObjectType } from "./data/category.types";
import { CompanyObjectType } from "./data/company.type";
import { BankObjectType } from "./data/bank.types";
import { CreditCardObjectType } from "./data/credit-card.types";

export type ErrorsBillForm<T> = {
    [k in keyof T]: ValidationErrors | null;
};

export type AbstractBillForm<T> = {
    [k in keyof T]: AbstractControl<string, string> | null;
};

export type InfoBillForm = {
    name: string;
    description: string;
    total: number;
    category: CategoryObjectType | null;
    type: PaymentTypes | null;
};

export type CheckBillForm = {
    settled: boolean;
    due: Date;
    paid: Date;
    isRecurrent: boolean;
};

export type BankBillForm = {
    bank1: BankObjectType | null;
    bank2: BankObjectType | null;
    isPayment: boolean;
    company: CompanyObjectType | null;
};

export type CompanyBillForm = {
    company: CompanyObjectType | null;
    bank1: BankObjectType | null;
    creditcard: CreditCardObjectType | null;
    totalParcel: number;
    parcels: number;
    delta: number;
};

export type CreditCardForm = {
    creditcard: CreditCardObjectType | null;
    company: CompanyObjectType | null;
    taxes: number;
    parcels: number;
    delta: number;
};

export type ConfigForm = {
    isPayment: boolean;
    isRecurrent: boolean;
    settled: boolean;
    due: Date | null;
    paid: Date | null;
    type: PaymentTypes;
};
