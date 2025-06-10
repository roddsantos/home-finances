import {
    DashboardSavingsType,
    MonthBillsType,
} from "src/app/core/types/subjects/dashboard.subjects";

export const DASHBOARD_SAVINGS_INITIALIZER: DashboardSavingsType = {
    totalIncome: 0,
    totalBanks: 0,
    totalSettled: 0,
    totalSavings: 0,
    totalPending: 0,
    totalPreview: 0,
    piggyBanksProgression: [],
};

export const MONTHBILLSTYPE_INITIALIZER: MonthBillsType = {
    total: 0,
    count: 0,
    day: 0,
};
