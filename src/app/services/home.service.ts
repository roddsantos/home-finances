import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { UserState } from "../core/subjects/subjects.user";
import { HomeState } from "../core/subjects/subjects.home";
import { LocalStorageService } from "./local-storage.service";
import { SumAndCountData } from "../core/types/services";
import { HOME } from "src/utils/constants/services";
import { Bill, BillData } from "../core/types/objects";
import { SubjectExpensesType, SubjectSavingsType } from "../core/types/subjects";

@Injectable({
    providedIn: "root",
})
export class HomeService {
    private http = inject(HttpClient);
    private user = inject(UserState);

    private homeState = inject(HomeState);
    private localStorageService = inject(LocalStorageService);

    getBillsInfo() {
        const user = this.localStorageService.getUser();

        return this.http.get<SubjectExpensesType>(HOME + `expenses/${user?.id}`);
    }

    getSavingsInfo() {
        const user = this.localStorageService.getUser();
        return this.http.get<SubjectSavingsType>(HOME + `savings/${user?.id}`);
    }

    getCreditCardsInfo() {
        const user = this.localStorageService.getUser();
        return this.http.get<SumAndCountData>(HOME + `invoices/${user?.id}`);
    }

    getRecentBills() {
        const user = this.localStorageService.getUser();
        return this.http.get<{ bills: (Bill & BillData)[] }>(
            HOME + "recents/" + user?.id
        );
    }
}
