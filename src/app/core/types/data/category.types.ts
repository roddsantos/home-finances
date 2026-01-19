export type CategoryObjectType = {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    userId: string;
    updatedAt: string;
    createdAt: string;
    deletedAt: string | null;
};

export type CategoryCreateType = {
    name: string;
    description: string;
    icon: string;
    color: string;
};

export type CategoryUpdateType = Partial<
    CategoryCreateType & {
        id: string;
    }
>;
