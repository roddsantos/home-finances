import { Injectable } from "@angular/core";
import { COMPANY } from "src/utils/constants/services";
import { mergeMap, switchMap, take } from "rxjs";
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
        return this.user.user$.pipe(
            take(1),
            switchMap((user) =>
                this.http.get<CompanyObjectType[]>(COMPANY + `/${user!.id}`)
            )
        );
    }

    createCompany(data: CompanyCreateType) {
        return this.user.user$.pipe(
            mergeMap((user) =>
                this.http.post<CompanyObjectType>(COMPANY, { ...data, userId: user!.id })
            )
        );
    }

    deleteCompany(id: string) {
        return this.http.delete(COMPANY + `/${id}`);
    }

    updateCompany(data: CompanyUpdateType) {
        return this.http.patch<CompanyObjectType>(COMPANY, data);
    }
}
