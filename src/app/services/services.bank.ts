import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BANK } from "src/utils/constants/services";
import { BankObject } from "../types/services";
import { UserState } from "../subjects/subjects.user";
import { mergeMap } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class ServiceBank {
    private http = inject(HttpClient);
    private user = inject(UserState);

    getBanks() {
        return this.user.user$.pipe(
            mergeMap((user) => this.http.get(BANK + `/${user?.id}`))
        );
    }

    createBank(data: BankObject) {
        return this.user.user$.pipe(
            mergeMap((user) => this.http.post(BANK, { ...data, userId: user!.id }))
        );
    }

    deleteBank(id: string) {
        return this.http.delete(BANK + `/${id}`);
    }

    updateBank(data: Omit<BankObject, "userId"> & { id: string }) {
        return this.http.put(BANK, data);
    }
}
