import { Injectable } from "@angular/core";
import { Service } from "./service";
import { mergeMap } from "rxjs";
import { DatabaseTrackType, SavingsType } from "../core/types/objects";
import { SAVINGS } from "src/utils/constants/services";

@Injectable({
    providedIn: "root",
})
export class ServiceSaving extends Service {
    createSaving(data: Omit<SavingsType, keyof DatabaseTrackType>) {
        return this.httpClient.post<SavingsType>(SAVINGS, data);
    }
}
