import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { TYPEBILL } from "src/utils/constants/services";

@Injectable({
    providedIn: "root",
})
export class ServiceTypeBill {
    constructor(private http: HttpClient) {}

    getTypeBills() {
        return this.http.get(TYPEBILL);
    }
}
