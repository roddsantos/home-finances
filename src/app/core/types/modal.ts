import { SizeType } from "./components";
import { Bank, Bill, BillData, Category, Company, CreditCard } from "./objects";

export type ModalDataType = {
    header: string | false;
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
    bill: Bill & BillData;
    size?: SizeType;
};

export type EditBankModalType = {
    header: string;
    bank: Bank;
    size?: SizeType;
};

export type EditCreditCardModalType = {
    header: string;
    creditCard: CreditCard;
    size?: SizeType;
};

export type EditCompanyModalType = {
    header: string;
    company: Company;
    size?: SizeType;
};

export type EditCategoryModalType = {
    header: string;
    category: Category;
    size?: SizeType;
};

export type ViewItemModalType = {
    header: string;
    item: any;
    size?: SizeType;
};

export type EventsListModalType = {
    header: string;
    events: Array<((Bill & BillData) | CreditCard) & { sector: string }>;
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
