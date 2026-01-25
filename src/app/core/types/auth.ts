import { UserObjectType } from "./data/user.types";

export type LoginPayloadType = {
    username: string;
    password: string;
};

export type LoginResponseType = {
    token: string;
    user: UserObjectType;
};

export type ValidatedTokenResponseType = {
    id: string;
    username: string;
    iat: number;
    exp: number;
};
