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
        return this.http.get<CategoryObjectType[]>(CATEGORY);
    }

    createCategory(data: CategoryCreateType) {
        return this.http.post<CategoryObjectType>(CATEGORY, data);
    }

    deleteCategory(id: string) {
        return this.http.delete(CATEGORY + `/${id}`);
    }

    updateCategory(data: CategoryUpdateType) {
        return this.http.patch<CategoryObjectType>(CATEGORY, data);
    }
}
