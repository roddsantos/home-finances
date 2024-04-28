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
    | "category"
    | "company"
    | "creditcard"
    | "bank"
    | "min"
    | "max"
    | "status";

export type AvailableDataFilters = "category" | "creditcard" | "bank" | "company";

export type FilterDisplay = {
    id: string | number;
    identifier: AvailableFilters;
    name: string | number;
};

export type ListAction = {
    icon: string;
    action: () => void;
    tooltip?: string;
    color?: string;
};

export type PaginationType = {
    page: number;
    limit: number;
};
