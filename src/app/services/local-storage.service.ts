import { Injectable } from "@angular/core";
import { User } from "src/app/core/types/objects";
import { BillsLayoutType } from "../core/types/subjects";

@Injectable({
    providedIn: "root",
})
export class LocalStorageService {
    setUser(user: User) {
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

    setTheme(theme: string) {
        localStorage.setItem("theme", theme);
    }

    getTheme() {
        let theme = localStorage.getItem("theme");
        return theme;
    }

    removeTheme() {
        localStorage.removeItem("theme");
    }

    getBillsLayout() {
        let billsView = localStorage.getItem("bills-view");
        return (billsView || "grid") as BillsLayoutType;
    }
}
