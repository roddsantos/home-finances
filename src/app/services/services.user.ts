import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { COMPANY, USER } from "src/utils/constants/services";
import { Observable } from "rxjs";
import { UserObject } from "../types/services";
import { User } from "../types/general";

@Injectable({
    providedIn: "root",
})
export class ServiceUser {
    constructor(private http: HttpClient) {}

    getUser(username: string) {
        return this.http.get(USER + `/${username}`);
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
