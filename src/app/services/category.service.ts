import { Injectable } from "@angular/core";
import { CategoryObject } from "src/app/core/types/services";
import { mergeMap, switchMap, take } from "rxjs";
import { GeneralService } from "./general.service";
import { CategoryObjectType } from "src/app/core/types/data/category.types";
import { CATEGORY } from "src/utils/constants/services";

@Injectable({
    providedIn: "root",
})
export class CategoryService extends GeneralService {
    getCategories() {
        return this.user.user$.pipe(
            take(1),
            switchMap((user) =>
                this.http.get<CategoryObjectType[]>(CATEGORY + `/${user!.id}`)
            )
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
        return this.http.patch(CATEGORY, data);
    }
}
