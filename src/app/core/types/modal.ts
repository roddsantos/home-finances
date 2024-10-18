import { SizeType } from "./components";
import { Bill, BillData } from "./objects";

export type ProfileDialogType = {
    header: string;
    username?: string;
    size?: SizeType;
};

export type EditBillModalType = {
    bill: Bill & BillData;
    size?: SizeType;
};

export type FooterModal = {
    type: "none" | "submit" | "alert";
    submit?: String;
    alert?: String;
};
