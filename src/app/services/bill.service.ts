import { inject, Injectable } from "@angular/core";
import { BILL } from "src/utils/constants/services";
import { switchMap, take } from "rxjs";
import { BillState } from "src/app/core/subjects/subjects.bill";
import { FilterDisplay } from "src/app/core/types/components";
import {
    BillCreateType,
    BillDataObjectType,
    BillsMetadataType,
    BillUpdateResponse,
    BillUpdateType,
    PaymentTypes,
} from "../core/types/data/bills.types";
import { GeneralService } from "./general.service";

@Injectable({
    providedIn: "root",
})
export class BillService extends GeneralService {
    private billState = inject(BillState);

    getBills(page?: number, limit?: number, filtersArray?: FilterDisplay[]) {
        const filters = this.localStorageService.getFilters();
        return this.billState.billsPagination$.pipe(
            take(1),
            switchMap((pagination) =>
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

    getPinnedBills() {
        const pinnedBills = this.localStorageService.getPinnedBills();

        return this.http.get<BillDataObjectType[]>(BILL + "/pinned", {
            params: {
                pinnedBills,
            },
        });
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
