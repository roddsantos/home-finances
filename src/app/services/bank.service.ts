import { Injectable } from "@angular/core";
import { BANK } from "src/utils/constants/services";
import { mergeMap, switchMap, take } from "rxjs";
import { GeneralService } from "./general.service";
import {
    BankCreateType,
    BankObjectType,
    BankUpdateType,
} from "../core/types/data/bank.types";

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

    createBank(data: BankCreateType) {
        return this.user.user$.pipe(
            mergeMap((user) =>
                this.http.post<BankObjectType>(BANK, {
                    ...data,
                    userId: user!.id,
                })
            )
        );
    }

    deleteBank(id: string) {
        return this.http.delete(BANK + `/${id}`);
    }

    updateBank(data: BankUpdateType) {
        return this.http.patch<BankObjectType>(BANK, data);
    }
}
