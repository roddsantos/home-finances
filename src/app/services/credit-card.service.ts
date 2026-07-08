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
        return this.http.get<CreditCardObjectType[]>(CREDIT_CARD);
    }

    createCreditCard(data: CreditCardCreateType) {
        return this.http.post<CreditCardObjectType>(CREDIT_CARD, data);
    }

    deleteCreditCard(id: string) {
        return this.http.delete(CREDIT_CARD + `/${id}`);
    }

    updateCreditCard(data: CreditCardUpdateType) {
        return this.http.patch<CreditCardObjectType>(CREDIT_CARD, data);
    }

    closeInvoice(id: string) {
        return this.http.patch(CREDIT_CARD + `/close/${id}`, {});
    }
}
