import { SizeType } from "./components";
import { Bank, Bill, BillData } from "./objects";

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

export type FooterModal = {
    type: "none" | "submit" | "alert";
    submit?: String;
    alert?: String;
};
