import {
    BillObjectBank,
    BillObjectCompany,
    BillObjectCredtCard,
    BillObjectService,
} from "../types/services";
import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BILL } from "src/utils/constants/services";
import { BillObject } from "../types/services";
import { UserState } from "../subjects/subjects.user";
import { mergeMap, zip } from "rxjs";
import { CustomFilterState } from "../components/custom-filter/custom-filter.subjects.component";

@Injectable({
    providedIn: "root",
})
export class ServiceBill {
    private http = inject(HttpClient);
    private user = inject(UserState);
    private filterState = inject(CustomFilterState);

    getBills(page: number, limit: number) {
        return zip([this.filterState.filters$, this.user.user$]).pipe(
            mergeMap(([filters, user]) =>
                this.http.get(BILL, {
                    params: {
                        data: filters ? JSON.stringify(filters) : "",
                        page,
                        limit,
                        userId: user!.id,
                    },
                })
            )
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
