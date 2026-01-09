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
        this._categories$.next(categories);
    }

    setCategory(tb: CategoryObjectType[]) {
        if (tb.length === 0) this.changeStatus("empty", "no categories");
        else this.changeVariant("none");

        this._categories$.next(tb);
    }

    addCategory(category: CategoryObjectType, index?: number) {
        let auxCategories = [...this._categories$.getValue()];
        const existingCompany = this._categories$
            .getValue()
            .find((c) => c.id === category.id);
        if (existingCompany && index !== undefined) auxCategories[index] = category;
        else auxCategories = [category, ...auxCategories];

        this._categories$.next(auxCategories);
    }

    setStatus(status: FeedbackInfo) {
        this._status$.next(status);
    }

    setAction(action: () => void) {
        this._status$.next({ ...this._status$.getValue(), action });
    }
}
