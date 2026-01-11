import { SizeType } from "./components";
import { BankObjectType } from "./data/bank.types";
import { BillDataObjectType } from "./data/bills.types";
import { CategoryObjectType } from "./data/category.types";
import { CompanyObjectType } from "./data/company.type";
import { CreditCardObjectType } from "./data/credit-card.types";

export type ModalDataType = {
    header?: string | false;
    size?: SizeType;
    data?: any;
};

export type ProfileDialogType = {
    header: string;
    username?: string;
    size?: SizeType;
    data?: any;
};

export type EditBillModalType = {
    bill: BillDataObjectType;
    size?: SizeType;
};

export type EditBankModalType = {
    header: string;
    bank: BankObjectType;
    size?: SizeType;
};

export type EditCreditCardModalType = {
    header: string;
    creditCard: CreditCardObjectType;
    size?: SizeType;
};

export type EditCompanyModalType = {
    header: string;
    company: CompanyObjectType;
    size?: SizeType;
};

export type EditCategoryModalType = {
    header: string;
    category: CategoryObjectType;
    size?: SizeType;
};

export type ViewItemModalType = {
    header: string;
    item: any;
    size?: SizeType;
};

export type EventsListModalType = {
    header: string;
    events: Array<(BillDataObjectType | CreditCardObjectType) & { sector: string }>;
    size: SizeType;
};

export type FooterModal = {
    type: "none" | "submit" | "alert";
    submitLabel?: String;
    alertLabel?: String;
};

export type SetupModalType = {
    header: string | false;
    size?: SizeType;
    footerType: "none" | "submit" | "alert";
    disabled?: boolean;
};
