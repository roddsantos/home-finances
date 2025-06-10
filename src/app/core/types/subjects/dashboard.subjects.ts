export type DashboardBillsPerMonthType = {
    total: number;
    count: number;
    delta: number;
    month: number;
    year: number;
};

export type MonthPiggyBankCountsType = {
    savedValue: number;
    delta: number;
    month: number;
    year: number;
};

export type PiggyBanksProgressionType = {
    bank: string;
    color: string;
    total: number;
    progression: MonthPiggyBankCountsType[];
};

export type DashboardSavingsType = {
    piggyBanksProgression: PiggyBanksProgressionType[];
    totalIncome: number;
    totalBanks: number;
    totalSettled: number;
    totalSavings: number;
    totalPending: number;
    totalPreview: number;
};

export type MonthBillsType = {
    count: number;
    total: number;
    day: number;
};
