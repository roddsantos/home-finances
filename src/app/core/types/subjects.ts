import { SumAndCountData } from "./services";

export type SubjectExpensesType = SumAndCountData & {
    delta: number;
    settled: number;
};

export type SubjectSavingsType = SumAndCountData & {
    toReceive: number;
    income: number;
};
