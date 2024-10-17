import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { COMPANY } from "src/utils/constants/services";
import { CompanyObject } from "../types/services";
import { UserState } from "src/app/core/subjects/subjects.user";
import { mergeMap } from "rxjs";
import { Company } from "../types/objects";

@Injectable({
    providedIn: "root",
})
export class ServiceCompany {
    private http = inject(HttpClient);
    private user = inject(UserState);

    getCompanies() {
        return this.user.user$.pipe(
            mergeMap((user) => this.http.get<Company[]>(COMPANY + `/${user!.id}`))
        );
    }

    createCompany(data: CompanyObject) {
        return this.user.user$.pipe(
            mergeMap((user) => this.http.post(COMPANY, { ...data, userId: user!.id }))
        );
    }

    deleteCompany(id: string) {
        return this.http.delete(COMPANY + `/${id}`);
    }

    updateCompany(data: Omit<CompanyObject, "userId"> & { id: string }) {
        return this.http.put(COMPANY, data);
    }
}
