import {
    BillObjectBank,
    BillObjectCompany,
    BillObjectCompanyUpdate,
    BillObjectCredtCard,
    BillObjectCredtCardUpdate,
} from "src/app/core/types/services";
import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BILL } from "src/utils/constants/services";
import { BillObject } from "src/app/core/types/services";
import { UserState } from "src/app/core/subjects/subjects.user";
import { mergeMap, zip } from "rxjs";
import { CustomFilterState } from "../components/custom-filter/custom-filter.subjects.component";
import { BillState } from "src/app/core/subjects/subjects.bill";
import { FilterDisplay } from "src/app/core/types/components";
import { PaymentTypes } from "../core/types/general";
import {
    BillCreateType,
    BillObjectType,
    BillsMetadataType,
    BillUpdateType,
} from "../core/types/data/bills.types";

@Injectable({
    providedIn: "root",
})
export class BillService {
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
                this.http.get<BillsMetadataType>(BILL, {
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

    createBillBank(data: BillCreateType) {
        return this.user.user$.pipe(
            mergeMap((user) =>
                this.http.post<BillObjectType>(BILL + "/transaction", {
                    ...data,
                    userId: user!.id,
                })
            )
        );
    }

    createBillCreditCard(data: BillCreateType) {
        return this.user.user$.pipe(
            mergeMap((user) =>
                this.http.post<BillObjectType>(BILL + "/cc", {
                    ...data,
                    userId: user!.id,
                })
            )
        );
    }

    createBillCompany(data: BillCreateType) {
        return this.user.user$.pipe(
            mergeMap((user) =>
                this.http.post<BillObjectType>(BILL + "/company", {
                    ...data,
                    userId: user!.id,
                })
            )
        );
    }

    updateBill(data: BillUpdateType, type: PaymentTypes) {
        switch (type) {
            case "money":
                return this.updateBillBank(data);
            case "companyCredit":
                return this.updateBillCompany(data);
            case "creditCard":
                return this.updateBillCreditCard(data);
        }
    }

    updateBillBank(data: BillUpdateType) {
        return this.user.user$.pipe(
            mergeMap((user) =>
                this.http.patch(BILL + "/transaction", { ...data, userId: user!.id })
            )
        );
    }

    updateBillCreditCard(data: BillUpdateType) {
        return this.user.user$.pipe(
            mergeMap((user) =>
                this.http.patch(BILL + "/cc", { ...data, userId: user!.id })
            )
        );
    }

    updateBillCompany(data: BillUpdateType) {
        return this.user.user$.pipe(
            mergeMap((user) =>
                this.http.patch(BILL + "/company", { ...data, userId: user!.id })
            )
        );
    }

    quickSettle(id: string) {
        return this.http.patch(BILL + "/quick-settle/" + id, {});
    }

    redoQuickSettle(id: string) {
        return this.http.patch(BILL + "/redo-quick-settle/" + id, {});
    }

    deleteBill(id: string) {
        return this.http.delete(BILL + `/${id}`);
    }
}
