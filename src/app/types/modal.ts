export type ProfileDialogType = {
    header: string;
    username: string;
};

export type FooterModal = {
    type: "none" | "submit" | "alert";
    submit?: String;
    alert?: String;
};
