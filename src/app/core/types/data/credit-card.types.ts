export type CreditCardObjectType = {
    id: string;
    name: string;
    description: string;
    color: string;
    limit: number;
    day: number;
    due: number;
    month: number;
    year: number;
    flag: string | null;
    limitLeft: number;
    isClosed: boolean;
    userId: string;
    invoice: number;
    updatedAt: string;
    createdAt: string;
    deletedAt: string | null;
};

export type CreditCardCreateType = {
    name: string;
    description: string;
    color: string;
    limit: number;
    day: number;
    due: number;
    month: number;
    year: number;
    flag: string | null;
    isClosed: boolean;
};

export type CreditCardUpdateType = Partial<
    CreditCardCreateType & {
        id: string;
        userId: string;
    }
>;

export type CrreditCardFlag = {
    name: string;
    id: string;
    icon: string;
};
