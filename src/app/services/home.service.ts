import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { LocalStorageService } from "./local-storage.service";
import { SumAndCountData } from "../core/types/services";
import { HOME } from "src/utils/constants/services";
import {
    SubjectExpensesType,
    SubjectSavingsType,
} from "../core/types/subjects/home.subjects.types";
import { DateSubjectType } from "../core/types/subjects/general.subjects.type";
import { BillDataObjectType } from "../core/types/data/bills.types";

@Injectable({
    providedIn: "root",
})
export class HomeService {
    private http = inject(HttpClient);
    private localStorageService = inject(LocalStorageService);

    getBillsInfo(date: DateSubjectType) {
        const params = { ...date };
        return this.http.get<SubjectExpensesType>(HOME + "expenses", {
            params,
        });
    }

    getSavingsInfo(date: DateSubjectType) {
        const params = { ...date };
        return this.http.get<SubjectSavingsType>(HOME + "savings", {
            params,
        });
    }

    getCreditCardsInfo(date: DateSubjectType) {
        const params = { ...date };
        return this.http.get<SumAndCountData>(HOME + "invoices", { params });
    }

    getRecentBills(date: DateSubjectType) {
        const params = { ...date };
        return this.http.get<{ bills: BillDataObjectType[] }>(HOME + "recents", {
            params,
        });
    }
}
