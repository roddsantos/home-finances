import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { LocalStorageService } from "./local-storage.service";
import { SumAndCountData } from "../core/types/services";
import { HOME } from "src/utils/constants/services";
import { Bill, BillData } from "../core/types/objects";
import {
    SubjectExpensesType,
    SubjectSavingsType,
} from "../core/types/subjects/home.subjects.types";
import { DateSubjectType } from "../core/types/subjects/general.subjects.type";

@Injectable({
    providedIn: "root",
})
export class HomeService {
    private http = inject(HttpClient);
    private localStorageService = inject(LocalStorageService);

    getBillsInfo(date: DateSubjectType) {
        const params = { ...date };
        const user = this.localStorageService.getUser();

        return this.http.get<SubjectExpensesType>(HOME + `expenses/${user?.id}`, {
            params,
        });
    }

    getSavingsInfo(date: DateSubjectType) {
        const params = { ...date };
        const user = this.localStorageService.getUser();
        return this.http.get<SubjectSavingsType>(HOME + `savings/${user?.id}`, {
            params,
        });
    }

    getCreditCardsInfo(date: DateSubjectType) {
        const params = { ...date };
        const user = this.localStorageService.getUser();
        return this.http.get<SumAndCountData>(HOME + `invoices/${user?.id}`, { params });
    }

    getRecentBills(date: DateSubjectType) {
        const params = { ...date };
        const user = this.localStorageService.getUser();
        return this.http.get<{ bills: (Bill & BillData)[] }>(
            HOME + "recents/" + user?.id,
            { params }
        );
    }
}
