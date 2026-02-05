import { Injectable } from "@angular/core";
import { mergeMap } from "rxjs";
import { DatabaseTrackType, SavingsType } from "../core/types/objects";
import { SAVINGS } from "src/utils/constants/services";
import { FetchPaginatedData } from "../core/types/services";
import { GeneralService } from "./general.service";

@Injectable({
    providedIn: "root",
})
export class ServiceSaving extends GeneralService {
    createSaving(data: Omit<SavingsType, keyof DatabaseTrackType>) {
        return this.http.post<SavingsType>(SAVINGS, data);
    }

    getSavings(bankId: string, page: number) {
        return this.http.get<FetchPaginatedData<SavingsType>>(
            SAVINGS + `/all?bankId=${bankId}&page=${page}`,
        );
    }

    bulkSavings() {
        const month = new Date().getMonth();
        const year = new Date().getFullYear();

        return this.http.post(SAVINGS + "/bulk", {
            month,
            year,
        });
    }
}
