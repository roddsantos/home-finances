import { AbstractControl, ValidationErrors } from "@angular/forms";
import { Bank, Company, CreditCard } from "./objects";
import { PaymentTypes } from "./general";
import { CategoryObjectType } from "./data/category.types";

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
    bank1: Bank | null;
    bank2: Bank | null;
    isPayment: boolean;
    company: Company | null;
};

export type CompanyBillForm = {
    company: Company | null;
    bank1: Bank | null;
    creditcard: CreditCard | null;
    totalParcel: number;
    parcels: number;
    delta: number;
};

export type CreditCardForm = {
    creditcard: CreditCard | null;
    company: Company | null;
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
