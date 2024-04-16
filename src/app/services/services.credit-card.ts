import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { COMPANY, CREDIT_CARD } from "src/utils/constants/services";
import { CreditCardObject } from "../types/services";

@Injectable({
    providedIn: "root",
})
export class ServiceCreditCard {
    constructor(private http: HttpClient) {}

    getCreditCards(userId: string) {
        return this.http.get(CREDIT_CARD + `/${userId}`);
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
