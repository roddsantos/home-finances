import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { SumAndCountData } from "../types/services";

@Injectable({
    providedIn: "root",
})
export class HomeState {
    private _expenses$ = new BehaviorSubject<SumAndCountData>({
        total: 0,
        count: 0,
    });
    private _savings$ = new BehaviorSubject<SumAndCountData>({
        total: 0,
        count: 0,
    });

    public readonly expenses$ = this._expenses$.asObservable();
    public readonly savings$ = this._savings$.asObservable();

    public updateExpenses(expenses: SumAndCountData) {
        this._expenses$.next(expenses);
    }

    public updateSavings(savings: SumAndCountData) {
        this._savings$.next(savings);
    }
}
