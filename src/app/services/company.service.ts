import { Injectable } from "@angular/core";
import { COMPANY } from "src/utils/constants/services";
import {
    CompanyCreateType,
    CompanyObjectType,
    CompanyUpdateType,
} from "src/app/core/types/data/company.type";
import { GeneralService } from "./general.service";

@Injectable({
    providedIn: "root",
})
export class CompanyService extends GeneralService {
    getCompanies() {
        return this.http.get<CompanyObjectType[]>(COMPANY);
    }

    createCompany(data: CompanyCreateType) {
        return this.http.post<CompanyObjectType>(COMPANY, data);
    }

    deleteCompany(id: string) {
        return this.http.delete(COMPANY + `/${id}`);
    }

    updateCompany(data: CompanyUpdateType) {
        return this.http.patch<CompanyObjectType>(COMPANY, data);
    }
}
