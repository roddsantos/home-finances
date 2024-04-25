import {
    BillObjectBank,
    BillObjectCompany,
    BillObjectCredtCard,
    BillObjectService,
    GetBillsFilter,
} from "../types/services";
import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BILL } from "src/utils/constants/services";
import { BillObject } from "../types/services";
import { UserState } from "../subjects/subjects.user";
import { mergeMap } from "rxjs";
import { parseFilters } from "src/utils/parser";

@Injectable({
    providedIn: "root",
})
export class ServiceBill {
    private http = inject(HttpClient);
    private user = inject(UserState);

    getBills(filters: GetBillsFilter) {
        return this.user.user$.pipe(
            mergeMap((user) => {
                return this.http.get(BILL, {
                    params: {
                        ...filters,
                        userId: user!.id,
                    },
                });
            })
        );
    }

    createBillBank(data: BillObject & BillObjectBank) {
        return this.user.user$.pipe(
            mergeMap((user) =>
                this.http.post(BILL + "/transaction", { ...data, userId: user!.id })
            )
        );
    }

    createBillCreditCard(data: BillObject & BillObjectCredtCard) {
        return this.user.user$.pipe(
            mergeMap((user) =>
                this.http.post(BILL + "/cc", { ...data, userId: user!.id })
            )
        );
    }

    createBillCompany(data: BillObject & BillObjectCompany) {
        return this.user.user$.pipe(
            mergeMap((user) =>
                this.http.post(BILL + "/company", { ...data, userId: user!.id })
            )
        );
    }

    createBillService(data: BillObject & BillObjectService) {
        return this.user.user$.pipe(
            mergeMap((user) =>
                this.http.post(BILL + "/service", { ...data, userId: user!.id })
            )
        );
    }

    deleteBill() {
        return this.user.user$.pipe(
            mergeMap((user) => this.http.delete(BILL + `${user!.id}`))
        );
    }

    updateBill(data: Omit<BillObject, "userId"> & { id: string }) {
        return this.http.put(BILL, data);
    }
}
