import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User } from "../types/general";

@Injectable({
    providedIn: "root",
})
export class LocalStorageService {
    constructor(private http: HttpClient) {}

    setUser(user: Object) {
        let str = JSON.stringify(user);
        localStorage.setItem("user", str);
        localStorage.setItem("hasUser", "true");
    }

    getUser() {
        let user = localStorage.getItem("user");
        return user ? (JSON.parse(user) as User) : null;
    }

    getHasUser() {
        let hasUser = localStorage.getItem("hasUser");
        return hasUser;
    }

    removeUser() {
        localStorage.removeItem("user");
        localStorage.removeItem("hasUser");
    }

    setTypeBills(typeBills: string) {
        localStorage.setItem("typeBills", typeBills);
        localStorage.setItem("hasTypeBills", "true");
    }

    getTypeBills() {
        let typeBills = localStorage.getItem("typeBills");
        return typeBills ? JSON.parse(typeBills) : null;
    }

    removeTypeBills() {
        localStorage.removeItem("typeBills");
        localStorage.removeItem("hasTypeBills");
    }
}
