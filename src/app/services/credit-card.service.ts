import { Injectable } from "@angular/core";
import { CREDIT_CARD } from "src/utils/constants/services";
import { CreditCardObject, GetCreditCard } from "src/app/core/types/services";
import { mergeMap, switchMap, take } from "rxjs";
import { CreditCard } from "src/app/core/types/objects";
import { GeneralService } from "./general.service";

@Injectable({
    providedIn: "root",
})
export class CreditCardService extends GeneralService {
    getCreditCards() {
        return this.user.user$.pipe(
            take(1),
            switchMap((user) =>
                this.http.get<CreditCard[]>(CREDIT_CARD, {
                    params: { userId: user!.id },
                })
            )
        );
    }

    createCreditCard(data: CreditCardObject) {
        return this.user.user$.pipe(
            mergeMap((user) => this.http.post(CREDIT_CARD, { ...data, userId: user!.id }))
        );
    }

    deleteCreditCard(id: string) {
        return this.http.delete(CREDIT_CARD + `/${id}`);
    }

    updateCreditCard(data: Omit<CreditCardObject, "userId"> & { id: string }) {
        return this.http.patch(CREDIT_CARD, data);
    }
}
