import { inject, Injectable } from "@angular/core";
import { USER } from "src/utils/constants/services";
import { LocalStorageService } from "./local-storage.service";
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
    private localStorageService = inject(LocalStorageService);

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
        const user = this.localStorageService.getUser();
        return this.http.patch<UserObjectType>(USER, { ...payload, id: user?.id });
    }

    updatePassword(payload: UpdatePasswordType) {
        const user = this.localStorageService.getUser();
        return this.http.patch(USER + "/password", { ...payload, id: user?.id });
    }
}
