export type ToggleButtonItemsType<T> = {
    value: T;
    label: string;
    icon?: {
        name: string;
        color: string;
    };
};

export type MonthYearToggleType = {
    month: number;
    year: number;
};

export type StyleToggleType = "outlined" | "text" | "fill";
