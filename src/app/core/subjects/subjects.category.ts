import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FeedbackInfo, FeedbackVariant } from "src/app/core/types/components";
import { CategoryObjectType } from "../types/data/category.types";

@Injectable({
    providedIn: "root",
})
export class CategoryState {
    private _categories$ = new BehaviorSubject<CategoryObjectType[]>([]);
    private _status$ = new BehaviorSubject<FeedbackInfo>({
        title: "loading",
        description: "",
        actionLabel: "reload",
        action: undefined,
        variant: "loading",
    });

    public readonly status$ = this._status$.asObservable();
    public readonly categories$ = this._categories$.asObservable();

    changeStatus(variant: FeedbackVariant, title: string) {
        console.log(variant, title);
        this._status$.next({ ...this._status$.getValue(), variant, title });
        if (variant !== "none" && variant !== "loading") this._categories$.next([]);
    }

    changeVariant(variant: FeedbackVariant) {
        this._status$.next({ ...this._status$.getValue(), variant });
    }

    setCategories(categories: CategoryObjectType[]) {
        if (categories.length === 0) this.changeStatus("empty", "no categories");
        else this.changeVariant("none");

        this._categories$.next(categories);
    }

    updateCategory(category: CategoryObjectType) {
        let auxCategories = [...this._categories$.getValue()];
        const indexCategory = this._categories$
            .getValue()
            .findIndex((c) => c.id === category.id);

        if (indexCategory >= 0) auxCategories[indexCategory] = category;
        this._categories$.next(auxCategories);
    }

    addCategory(category: CategoryObjectType) {
        let auxCategories = [...this._categories$.getValue()];

        const categoriesArray = [category, ...auxCategories].sort((cat1, cat2) => {
            if (cat1.name > cat2.name) return -1;
            return 1;
        });

        this._categories$.next(categoriesArray);
    }

    setStatus(status: FeedbackInfo) {
        this._status$.next(status);
    }

    setAction(action: () => void) {
        this._status$.next({ ...this._status$.getValue(), action });
    }

    getCategory(id: string) {
        let auxCategories = [...this._categories$.getValue()];
        const category = auxCategories.find((category) => category.id === id);

        return category;
    }
}
