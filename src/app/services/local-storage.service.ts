import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User } from "src/app/types/objects";

@Injectable({
    providedIn: "root",
})
export class LocalStorageService {
    constructor(private http: HttpClient) {}

    setUser(user: Object) {
        let str = JSON.stringify(user);
        localStorage.setItem("user", str);
    }

    getUser() {
        let user = localStorage.getItem("user");
        return user ? (JSON.parse(user) as User) : null;
    }

    removeUser() {
        localStorage.removeItem("user");
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
