import { MatSnackBarConfig } from "@angular/material/snack-bar";

export type SnackbarVariant = "info" | "warning" | "error" | "success" | "default";

export type SnackbarData = {
    message: string;
    variant?: SnackbarVariant;
    options?: MatSnackBarConfig<any>;
    actionLabel?: string;
    action?: () => void;
};
