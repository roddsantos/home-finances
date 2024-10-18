import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { USER } from "src/utils/constants/services";
import { UserObject } from "src/app/core/types/services";
import { User } from "src/app/core/types/objects";

@Injectable({
    providedIn: "root",
})
export class ServiceUser {
    constructor(private http: HttpClient) {}

    getUser(username: string) {
        return this.http.get<User>(USER + `/${username}`);
    }

    createUser(data: UserObject) {
        return this.http.post(USER, data);
    }

    deleteUser(id: string) {
        return this.http.delete(USER + `/${id}`);
    }

    updateUser(data: UserObject & { id: string }) {
        return this.http.put(USER, data);
    }
}
