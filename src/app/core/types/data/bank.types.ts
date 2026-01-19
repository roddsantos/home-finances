export type BankObjectType = {
    id: string;
    name: string;
    description: string;
    color: string;
    savings: number;
    userId: string;
    isPiggyBank: boolean;
    updatedAt: string;
    createdAt: string;
    deletedAt: string | null;
};

export type BankCreateType = {
    name: string;
    description: string;
    color: string;
    savings: number;
    isPiggyBank: boolean;
};

export type BankUpdateType = Partial<
    BankCreateType & {
        id: string;
        userId: string;
    }
>;
