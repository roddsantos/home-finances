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
    }

    getTypeBills() {
        let typeBills = localStorage.getItem("typeBills");
        return typeBills ? JSON.parse(typeBills) : null;
    }

    removeTypeBills() {
        localStorage.removeItem("typeBills");
        localStorage.removeItem("hasTypeBills");
    }

    setFilters(filters: string) {
        localStorage.setItem("filters", filters);
    }

    getFilters() {
        let filters = localStorage.getItem("filters");
        return filters ? JSON.parse(filters) : null;
    }

    removeFilters() {
        localStorage.removeItem("filters");
    }
}
