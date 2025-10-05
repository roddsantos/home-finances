import { MonthType } from "../general";

export type ToggleButtonItemsType<T> = {
    value: T;
    label: string;
};

export type MonthYearToggleType = {
    month: number;
    year: number;
};
