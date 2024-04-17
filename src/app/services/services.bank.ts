import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BANK } from "src/utils/constants/services";
import { BankObject } from "../types/services";

@Injectable({
    providedIn: "root",
})
export class ServiceBank {
    constructor(private http: HttpClient) {}

    getBanks(id: string) {
        return this.http.get(BANK + `/${id}`);
    }

    createBank(data: BankObject) {
        return this.http.post(BANK, data);
    }

    deleteBank(id: string) {
        return this.http.delete(BANK + `/${id}`);
    }

    updateBank(data: Omit<BankObject, "userId"> & { id: string }) {
        return this.http.put(BANK, data);
    }
}
