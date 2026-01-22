import { Injectable } from "@angular/core";
import { BillsLayoutType } from "../core/types/subjects";
import { ThemeObjectType } from "../core/types/pages/theme";
import { UserObjectType } from "../core/types/data/user.types";

@Injectable({
    providedIn: "root",
})
export class LocalStorageService {
    getToken() {
        return localStorage.getItem("token") || "";
    }

    setUser(user: UserObjectType) {
        let str = JSON.stringify(user);
        localStorage.setItem("user", str);
    }

    getUser() {
        let user = localStorage.getItem("user");
        return user ? (JSON.parse(user) as UserObjectType) : null;
    }

    removeUser() {
        localStorage.removeItem("user");
    }

    getFilterContainerStatus() {
        return localStorage.getItem("filterContainer");
    }

    setFilterContainer(status: boolean) {
        localStorage.setItem("filterContainer", `${status}`);
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

    setTheme(theme: ThemeObjectType) {
        let str = JSON.stringify(theme);
        localStorage.setItem("theme", str);
    }

    getTheme() {
        try {
            let theme = localStorage.getItem("theme");
            return theme ? JSON.parse(theme) : null;
        } catch (error) {
            return null;
        }
    }

    removeTheme() {
        localStorage.removeItem("theme");
    }

    getBillsLayout() {
        let billsView = localStorage.getItem("bills-view");
        return (billsView || "grid") as BillsLayoutType;
    }
}
