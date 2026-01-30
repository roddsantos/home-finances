import { Injectable } from "@angular/core";
import { USER } from "src/utils/constants/services";
import { GeneralService } from "./general.service";
import {
    UpdatePasswordType,
    UserCreateType,
    UserObjectType,
    UserUpdateType,
} from "../core/types/data/user.types";

@Injectable({
    providedIn: "root",
})
export class UserService extends GeneralService {
    getUser(username: string) {
        return this.http.get<UserObjectType>(USER + `/${username}`);
    }

    createUser(payload: UserCreateType) {
        return this.http.post<UserCreateType>(USER, payload);
    }

    deleteUser(id: string) {
        return this.http.delete<string>(USER + `/${id}`);
    }

    updateUser(payload: UserUpdateType) {
        return this.http.patch<UserObjectType>(USER, { ...payload });
    }

    updatePassword(payload: UpdatePasswordType) {
        return this.http.patch(USER + "/password", {
            newPassword: payload.newPassword,
        });
    }
}
