export type UserObjectType = {
    id: string;
    name: string;
    password: string;
    surname: string;
    username: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
};

export type UserCreateType = {
    name: string;
    password: string;
    surname: string;
    username: string;
};

export type UserUpdateType = Partial<UserCreateType> & {
    id: string;
};

export type UpdatePasswordType = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};
