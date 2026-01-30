import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BILL } from "src/utils/constants/services";
import { UserState } from "src/app/core/subjects/subjects.user";
import { mergeMap, zip } from "rxjs";
import { CustomFilterState } from "../components/custom-filter/custom-filter.subjects.component";
import { BillState } from "src/app/core/subjects/subjects.bill";
import { FilterDisplay } from "src/app/core/types/components";
import {
    BillCreateType,
    BillsMetadataType,
    BillUpdateResponse,
    BillUpdateType,
    PaymentTypes,
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
        return zip([this.filterState.filters$, this.billState.billsPagination$]).pipe(
            mergeMap(([filters, pagination]) =>
                this.http.get<BillsMetadataType>(BILL, {
                    params: {
                        data: filtersArray
                            ? JSON.stringify(filtersArray)
                            : filters
                              ? JSON.stringify(filters)
                              : "",
                        page: page || pagination.page,
                        limit: limit || pagination.limit,
                    },
                }),
            ),
        );
    }

    createBillBank(data: BillCreateType) {
        return this.http.post<BillUpdateResponse>(BILL + "/transaction", {
            ...data,
        });
    }

    createBillCreditCard(data: BillCreateType) {
        return this.http.post<BillUpdateResponse>(BILL + "/cc", {
            ...data,
        });
    }

    createBillCompany(data: BillCreateType) {
        return this.http.post<BillUpdateResponse>(BILL + "/company", {
            ...data,
        });
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
        return this.http.patch<BillUpdateResponse>(BILL + "/transaction", {
            ...data,
        });
    }

    updateBillCreditCard(data: BillUpdateType) {
        return this.http.patch<BillUpdateResponse>(BILL + "/cc", {
            ...data,
        });
    }

    updateBillCompany(data: BillUpdateType) {
        return this.http.patch<BillUpdateResponse>(BILL + "/company", {
            ...data,
        });
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
