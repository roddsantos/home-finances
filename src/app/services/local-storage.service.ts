import { Injectable } from "@angular/core";
import { BillsLayoutType } from "../core/types/subjects";
import { ThemeObjectType } from "../core/types/pages/theme";
import { UserObjectType } from "../core/types/data/user.types";
import { DEFAULT_THEME } from "src/utils/constants/colors";

@Injectable({
    providedIn: "root",
})
export class LocalStorageService {
    // TOKEN FUNCTIONS
    setToken(token: string) {
        localStorage.setItem("token", token);
    }

    getToken() {
        return localStorage.getItem("token") || "";
    }

    removeToken() {
        localStorage.removeItem("token");
    }

    // USER FUNCTIONS
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

    // FILTER CONTAINER
    getFilterContainerStatus() {
        return localStorage.getItem("filterContainer") || "true";
    }

    setFilterContainer(status: boolean) {
        localStorage.setItem("filterContainer", `${status}`);
    }

    // FILTERS
    setFilters(filters: string) {
        localStorage.setItem("filters", filters);
    }

    getFilters() {
        let filters = localStorage.getItem("filters");
        return filters ? JSON.parse(filters) : [];
    }

    removeFilters() {
        localStorage.removeItem("filters");
    }

    // THEMES
    setTheme(theme: ThemeObjectType) {
        let str = JSON.stringify(theme);
        localStorage.setItem("theme", str);
    }

    getTheme() {
        try {
            let theme = localStorage.getItem("theme");
            return theme ? JSON.parse(theme) : DEFAULT_THEME;
        } catch (error) {
            return null;
        }
    }

    removeTheme() {
        localStorage.removeItem("theme");
    }

    getBillsLayout() {
        let billsView = localStorage.getItem("bills-view");
        return (billsView || "list") as BillsLayoutType;
    }

    setPinnedBills(ids: string[]) {
        const stringifiedIds = JSON.stringify(ids);
        localStorage.setItem("pinned-bills", stringifiedIds);
    }

    getPinnedBills(): string[] {
        const pinnedBills = localStorage.getItem("pinned-bills");
        if (pinnedBills) {
            return JSON.parse(pinnedBills);
        } else return [];
    }

    removePinnedBill(id: string) {
        const stringPinnedBills = localStorage.getItem("pinned-bills");
        if (stringPinnedBills) {
            const pinnedBills = JSON.parse(stringPinnedBills) as string[];
            const index = pinnedBills.findIndex((pinId) => id === pinId);
            if (index >= 0) {
                pinnedBills.splice(index, 1);
                this.setPinnedBills(pinnedBills);
            }
        }
    }
}
