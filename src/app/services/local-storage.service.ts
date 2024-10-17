import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User } from "src/app/types/objects";
import { ThemeType } from "../types/general";
import { GeneralState } from "src/app/core/subjects/subjects.general";

@Injectable({
    providedIn: "root",
})
export class LocalStorageService {
    public generalState = inject(GeneralState);

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

    // setTypeBills(typeBills: string) {
    //     localStorage.setItem("typeBills", typeBills);
    // }

    // getTypeBills() {
    //     let typeBills = localStorage.getItem("typeBills");
    //     return typeBills ? JSON.parse(typeBills) : null;
    // }

    // removeTypeBills() {
    //     localStorage.removeItem("typeBills");
    //     localStorage.removeItem("hasTypeBills");
    // }

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

    setTheme(theme: ThemeType) {
        localStorage.setItem("theme", theme);
        this.generalState.changeTheme(theme);
    }

    getTheme() {
        let theme = localStorage.getItem("theme");
        return theme;
    }

    removeTheme() {
        localStorage.removeItem("theme");
        this.generalState.changeTheme("default");
    }
}
