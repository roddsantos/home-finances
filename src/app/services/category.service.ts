import { Injectable } from "@angular/core";
import { mergeMap, switchMap, take } from "rxjs";
import { GeneralService } from "./general.service";
import {
    CategoryCreateType,
    CategoryObjectType,
    CategoryUpdateType,
} from "src/app/core/types/data/category.types";
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

    createCategory(data: CategoryCreateType) {
        return this.user.user$.pipe(
            mergeMap((user) =>
                this.http.post<CategoryObjectType>(CATEGORY, {
                    ...data,
                    userId: user!.id,
                })
            )
        );
    }

    deleteCategory(id: string) {
        return this.http.delete(CATEGORY + `/${id}`);
    }

    updateCategory(data: CategoryUpdateType) {
        return this.http.patch<CategoryObjectType>(CATEGORY, data);
    }
}
