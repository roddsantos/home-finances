import { Injectable } from "@angular/core";
import { BANK } from "src/utils/constants/services";
import { BankObject } from "src/app/core/types/services";
import { mergeMap, switchMap, take } from "rxjs";
import { GeneralService } from "./general.service";
import { BankObjectType } from "../core/types/data/bank.types";

@Injectable({
    providedIn: "root",
})
export class BankService extends GeneralService {
    getBanks() {
        return this.user.user$.pipe(
            take(1),
            switchMap((user) => this.http.get<BankObjectType[]>(BANK + `/${user!.id}`))
        );
    }

    createBank(data: Omit<BankObject, "userId">) {
        return this.user.user$.pipe(
            mergeMap((user) => this.http.post(BANK, { ...data, userId: user!.id }))
        );
    }

    deleteBank(id: string) {
        return this.http.delete(BANK + `/${id}`);
    }

    updateBank(data: Omit<BankObject, "userId"> & { id: string }) {
        return this.http.patch(BANK, data);
    }
}
