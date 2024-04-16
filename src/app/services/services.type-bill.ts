import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { COMPANY, TYPEBILL, USER } from "src/utils/constants/services";
import { Observable } from "rxjs";
import { UserObject } from "../types/services";
import { User } from "../types/general";

@Injectable({
    providedIn: "root",
})
export class ServiceTypeBill {
    constructor(private http: HttpClient) {}

    getTypeBills() {
        return this.http.get(TYPEBILL);
    }
}
