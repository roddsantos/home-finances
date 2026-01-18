export type MonthlySavingsTypes = "start";

export type SavingsType = {
    id: string;
    bankId: string;
    total: number;
    month: number;
    year: number;
    type: MonthlySavingsTypes;
    updatedAt: string;
    createdAt: string;
    deletedAt: string | null;
};

export type DatabaseTrackType = {
    id: string;
    updatedAt: string;
    createdAt: string;
    deletedAt: string | null;
};
