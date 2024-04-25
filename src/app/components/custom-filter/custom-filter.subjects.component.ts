import { inject, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { LocalStorageService } from "src/app/services/local-storage.service";
import {
    AvailableFilters,
    FilterDisplay,
    LimitFilter,
    ListFilter,
    MonthFilter,
    YearFilter,
} from "src/app/types/components";

@Injectable({
    providedIn: "root",
})
export class CustomFilterState {
    public localStorage = inject(LocalStorageService);

    private _filters$ = new BehaviorSubject<FilterDisplay[]>([]);
    private _datafilters$ = new BehaviorSubject<ListFilter[]>([]);
    private _monthFilters$ = new BehaviorSubject<MonthFilter[]>([]);
    private _yearFilters$ = new BehaviorSubject<YearFilter[]>([]);
    private _limitFilters$ = new BehaviorSubject<LimitFilter[]>([]);
    private _availableFilters$ = new BehaviorSubject<AvailableFilters[]>([]);

    public readonly datafilters$ = this._datafilters$.asObservable();
    public readonly monthFilter$ = this._monthFilters$.asObservable();
    public readonly yearFilter$ = this._yearFilters$.asObservable();
    public readonly limitFilter$ = this._limitFilters$.asObservable();
    public readonly filters$ = this._filters$.asObservable();

    addMonth(month: MonthFilter) {
        let auxMonths = [...this._monthFilters$.getValue()];
        auxMonths.push(month);
        this._monthFilters$.next(auxMonths);
    }

    removeMonth(month: MonthFilter) {
        let index = this._monthFilters$
            .getValue()
            .findIndex((m) => m.name === month.name);
        let auxMonths = [...this._monthFilters$.getValue()];
        if (index >= 0) auxMonths.splice(index, 1);
        this._monthFilters$.next(auxMonths);
    }

    addYear(year: YearFilter) {
        const existingYear = this._yearFilters$.getValue().find((y) => y === year);
        if (existingYear === undefined) {
            let auxYear = [...this._yearFilters$.getValue()];
            auxYear.push(year);
            this._yearFilters$.next(auxYear);
        }
    }

    removeYear(year: YearFilter) {
        const index = this._yearFilters$.getValue().findIndex((y) => y === year);
        if (index) {
            let auxYear = [...this._yearFilters$.getValue()];
            auxYear.splice(index, 1);
            this._yearFilters$.next(auxYear);
        }
    }

    addLimit(limit: LimitFilter) {
        const index = this._limitFilters$
            .getValue()
            .findIndex((y) => y.identifier === limit.identifier);
        if (index === undefined) {
            let auxLimit = [...this._limitFilters$.getValue()];
            auxLimit.push(limit);
            this._limitFilters$.next(auxLimit);
        }
    }

    setFilters(filters: FilterDisplay[]) {
        this._filters$.next(filters);
    }

    removeFilter(filter: FilterDisplay) {
        const index = this._filters$.getValue().findIndex((f) => f.id === filter.id);
        if (index >= 0) {
            let auxFilter = [...this._filters$.getValue()];
            auxFilter.splice(index, 1);
            this._filters$.next(auxFilter);
            this.localStorage.setFilters(JSON.stringify(auxFilter));
        }
    }

    setAvailableFilters(availableFilters: AvailableFilters[]) {
        this._availableFilters$.next(availableFilters);
    }
}
