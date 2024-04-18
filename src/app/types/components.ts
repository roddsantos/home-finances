import { MatSnackBarConfig } from "@angular/material/snack-bar";

// Snackbar types
export type SnackbarVariant = "info" | "warning" | "error" | "success" | "default";

export type SnackbarData = {
    message: string;
    variant?: SnackbarVariant;
    options?: MatSnackBarConfig<any>;
    actionLabel?: string;
    action?: () => void;
};

// Feedback types

export type FeedbackVariant = "error" | "http" | "loading" | "empty" | "none";

export type FeedbackInfo = {
    variant: FeedbackVariant;
    title: string;
    description?: string;
    actionLabel?: string;
    action?: () => void;
};

export type SizeType = "xm" | "sm" | "md" | "lg" | "xl";

export type AvailableFilters =
    | "month"
    | "year"
    | "typebill"
    | "company"
    | "creditcard"
    | "bank"
    | "min"
    | "max"
    | "datespam";

export type AvailableDataFilters = "typebill" | "creditcard" | "bank" | "company";

export type ListFilter = {
    id: string;
    identifier: AvailableDataFilters;
    name: string;
};

export type MonthFilter = {
    id: number;
    identifier: "month";
    name: string;
};

export type YearFilter = {
    id: number;
    identifier: "year";
    name: number;
};

export type FilterDisplay = {
    id: string | number;
    identifier: AvailableFilters;
    name: string | number;
};
