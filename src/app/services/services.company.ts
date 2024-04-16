import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { COMPANY } from "src/utils/constants/services";
import { CompanyObject } from "../types/services";

@Injectable({
    providedIn: "root",
})
export class ServiceCompany {
    constructor(private http: HttpClient) {}

    getCompanies() {
        return this.http.get(COMPANY);
    }

    createCompany(data: CompanyObject) {
        return this.http.post(COMPANY, data);
    }

    deleteCompany(id: string) {
        return this.http.delete(COMPANY + `/${id}`);
    }

    updateCompany(data: Omit<CompanyObject, "userId"> & { id: string }) {
        return this.http.put(COMPANY, data);
    }
}
