import {
    BillObjectBank,
    BillObjectCompany,
    BillObjectCompanyUpdate,
    BillObjectCredtCard,
    BillObjectCredtCardUpdate,
    FetchPaginatedData,
} from "src/app/core/types/services";
import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BILL } from "src/utils/constants/services";
import { BillObject } from "src/app/core/types/services";
import { UserState } from "src/app/core/subjects/subjects.user";
import { mergeMap, zip } from "rxjs";
import { CustomFilterState } from "../components/custom-filter/custom-filter.subjects.component";
import { BillState } from "src/app/core/subjects/subjects.bill";
import { Bill, BillData } from "src/app/core/types/objects";
import { FilterDisplay } from "src/app/core/types/components";

@Injectable({
    providedIn: "root",
})
export class ServiceBill {
    private http = inject(HttpClient);
    private user = inject(UserState);
    private filterState = inject(CustomFilterState);
    private billState = inject(BillState);

    getBills(page?: number, limit?: number, filtersArray?: FilterDisplay[]) {
        return zip([
            this.filterState.filters$,
            this.billState.billsPagination$,
            this.user.user$,
        ]).pipe(
            mergeMap(([filters, pagination, user]) =>
                this.http.get<FetchPaginatedData<Bill & BillData>>(BILL, {
                    params: {
                        data: filtersArray
                            ? JSON.stringify(filtersArray)
                            : filters
                            ? JSON.stringify(filters)
                            : "",
                        page: page || pagination.page,
                        limit: limit || pagination.limit,
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

    updateBillBank(data: BillObject & BillObjectBank & { id: string }) {
        return this.user.user$.pipe(
            mergeMap((user) =>
                this.http.patch(BILL + "/transaction", { ...data, userId: user!.id })
            )
        );
    }

    updateBillCreditCard(
        data: BillObject & BillObjectCredtCard & BillObjectCredtCardUpdate
    ) {
        return this.user.user$.pipe(
            mergeMap((user) =>
                this.http.patch(BILL + "/cc", { ...data, userId: user!.id })
            )
        );
    }

    updateBillCompany(data: BillObject & BillObjectCompany & BillObjectCompanyUpdate) {
        return this.user.user$.pipe(
            mergeMap((user) =>
                this.http.patch(BILL + "/company", { ...data, userId: user!.id })
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
