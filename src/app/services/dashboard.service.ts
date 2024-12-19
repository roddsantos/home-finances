import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { UserState } from "../core/subjects/subjects.user";
import { mergeMap } from "rxjs";
import { Bill, BillData } from "../core/types/objects";
import { BILL, DASHBOARD } from "src/utils/constants/services";

@Injectable({
    providedIn: "root",
})
export class DashboardService {
    private http = inject(HttpClient);
    private user = inject(UserState);

    getMonthSpanBills(monthSpan: number) {
        return this.user.user$.pipe(
            mergeMap((user) =>
                this.http.get<Array<Bill & BillData>[]>(DASHBOARD + "/months", {
                    params: { monthSpan, userId: user!.id },
                })
            )
        );
    }

    getMonthBills() {
        return this.user.user$.pipe(
            mergeMap((user) =>
                this.http.get<Array<Bill & BillData>>(DASHBOARD + "/bills", {
                    params: { userId: user!.id },
                })
            )
        );
    }

    getSavingsInfo() {
        return this.user.user$.pipe(
            mergeMap((user) =>
                this.http.get<Array<Bill & BillData>>(DASHBOARD + "/savings", {
                    params: { userId: user!.id },
                })
            )
        );
    }
}
