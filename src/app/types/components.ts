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
