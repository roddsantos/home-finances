import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CREDIT_CARD } from "src/utils/constants/services";
import { CreditCardObject, GetCreditCard } from "../types/services";

@Injectable({
    providedIn: "root",
})
export class ServiceCreditCard {
    constructor(private http: HttpClient) {}

    getCreditCards(data: GetCreditCard) {
        const stringfyHeader = JSON.stringify(data);
        return this.http.get(CREDIT_CARD, {
            params: {
                filters: stringfyHeader,
            },
        });
    }

    createCreditCard(data: CreditCardObject) {
        return this.http.post(CREDIT_CARD, data);
    }

    deleteCreditCard(id: string) {
        return this.http.delete(CREDIT_CARD + `/${id}`);
    }

    updateCreditCard(data: Omit<CreditCardObject, "userId"> & { id: string }) {
        return this.http.put(CREDIT_CARD, data);
    }
}
