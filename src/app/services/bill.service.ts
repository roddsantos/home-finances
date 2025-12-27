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
import { BillsMetadataType } from "../core/types/pages/bills";
import { PaymentTypes } from "../core/types/general";

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

    updateBill(data: any, type: PaymentTypes) {
        switch (type) {
            case "money":
                return this.updateBillBank(
                    data as BillObject & BillObjectBank & { id: string }
                );
            case "companyCredit":
                return this.updateBillCompany(
                    data as BillObject & BillObjectCredtCard & BillObjectCredtCardUpdate
                );
            case "creditCard":
                return this.updateBillCreditCard(
                    data as BillObject & BillObjectCredtCard & BillObjectCredtCardUpdate
                );
        }
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

    updateBillCompany(
        data: Partial<BillObject & BillObjectCompany & BillObjectCompanyUpdate>
    ) {
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
}
