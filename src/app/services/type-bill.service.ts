import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CATEGORY } from "src/utils/constants/services";

@Injectable({
    providedIn: "root",
})
export class ServiceCategory {
    constructor(private http: HttpClient) {}

    getCategories() {
        return this.http.get(CATEGORY);
    }
}
