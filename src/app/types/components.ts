export type SnackbarVariant = "info" | "warning" | "error" | "success" | "default";

export type SnackbarData = {
    message: String;
    variant?: SnackbarVariant;
    action?: () => void;
};
