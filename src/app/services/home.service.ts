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
import { HomeSearchReturnSectionsType, ItemTypes } from "../core/types/data/home.types";

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

    getItems(searchTerm: string) {
        const params = { searchTerm };
        return this.http.get<HomeSearchReturnSectionsType>(HOME + "search", {
            params,
        });
    }

    getItem(id: string, type: ItemTypes) {
        return this.http.get<HomeSearchReturnSectionsType>(HOME + "item", {
            params: { id, type },
        });
    }
}
