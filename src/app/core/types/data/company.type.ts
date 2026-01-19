export type CompanyObjectType = {
    id: string;
    name: string;
    description: string;
    color: string;
    userId: string;
    updatedAt: string;
    createdAt: string;
    deletedAt: string | null;
};

export type CompanyCreateType = {
    name: string;
    description: string;
    color: string;
};

export type CompanyUpdateType = Partial<
    CompanyCreateType & {
        id: string;
    }
>;
