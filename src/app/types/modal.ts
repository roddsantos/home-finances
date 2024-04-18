import { SizeType } from "./components";

export type ProfileDialogType = {
    header: string;
    username?: string;
    size?: SizeType;
};

export type FooterModal = {
    type: "none" | "submit" | "alert";
    submit?: String;
    alert?: String;
    disabled?: boolean;
};
