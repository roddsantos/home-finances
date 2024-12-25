import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { USER } from "src/utils/constants/services";
import { UserObject, UserUpdateType } from "src/app/core/types/services";
import { User } from "src/app/core/types/objects";
import { UserState } from "../core/subjects/subjects.user";
import { LocalStorageService } from "./local-storage.service";

@Injectable({
    providedIn: "root",
})
export class UserService {
    private storage = inject(LocalStorageService);
    private http = inject(HttpClient);

    getUser(username: string) {
        return this.http.get<User>(USER + `/${username}`);
    }

    createUser(data: UserObject) {
        return this.http.post(USER, data);
    }

    deleteUser(id: string) {
        return this.http.delete(USER + `/${id}`);
    }

    updateUser(data: UserObject) {
        const user = this.storage.getUser();
        return this.http.patch<UserUpdateType>(USER, { ...data, id: user?.id });
    }
}
