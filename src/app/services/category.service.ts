import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CATEGORY } from "src/utils/constants/services";
import { CategoryObject } from "src/app/core/types/services";
import { UserState } from "src/app/core/subjects/subjects.user";
import { mergeMap } from "rxjs";
import { Category } from "src/app/core/types/objects";

@Injectable({
    providedIn: "root",
})
export class ServiceCategory {
    private user = inject(UserState);
    private http = inject(HttpClient);

    getCategories() {
        return this.user.user$.pipe(
            mergeMap((user) => this.http.get<Category[]>(CATEGORY + `/${user!.id}`))
        );
    }

    createCategory(data: CategoryObject) {
        return this.user.user$.pipe(
            mergeMap((user) => this.http.post(CATEGORY, { ...data, userId: user!.id }))
        );
    }

    deleteCategory(id: string) {
        return this.http.delete(CATEGORY + `/${id}`);
    }

    updateCategory(data: Omit<CategoryObject, "userId"> & { id: string }) {
        return this.http.put(CATEGORY, data);
    }
}
