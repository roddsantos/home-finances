import { Injectable } from "@angular/core";
import { BANK } from "src/utils/constants/services";
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
        return this.http.get<BankObjectType[]>(BANK);
    }

    createBank(data: BankCreateType) {
        return this.http.post<BankObjectType>(BANK, data);
    }

    deleteBank(id: string) {
        return this.http.delete(BANK + `/${id}`);
    }

    updateBank(data: BankUpdateType) {
        return this.http.patch<BankObjectType>(BANK, data);
    }
}
