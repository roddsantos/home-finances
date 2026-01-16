import { Injectable } from "@angular/core";
import { CREDIT_CARD } from "src/utils/constants/services";
import { mergeMap, switchMap, take } from "rxjs";
import { GeneralService } from "./general.service";
import {
    CreditCardCreateType,
    CreditCardObjectType,
    CreditCardUpdateType,
} from "../core/types/data/credit-card.types";

@Injectable({
    providedIn: "root",
})
export class CreditCardService extends GeneralService {
    getCreditCards() {
        return this.user.user$.pipe(
            take(1),
            switchMap((user) =>
                this.http.get<CreditCardObjectType[]>(CREDIT_CARD + `/${user!.id}`)
            )
        );
    }

    createCreditCard(data: CreditCardCreateType) {
        return this.user.user$.pipe(
            mergeMap((user) =>
                this.http.post<CreditCardObjectType>(CREDIT_CARD, {
                    ...data,
                    userId: user!.id,
                })
            )
        );
    }

    deleteCreditCard(id: string) {
        return this.http.delete(CREDIT_CARD + `/${id}`);
    }

    updateCreditCard(data: CreditCardUpdateType) {
        return this.http.patch<CreditCardObjectType>(CREDIT_CARD, data);
    }
}
