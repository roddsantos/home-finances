import { inject, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { FilterDisplay } from "src/app/core/types/components";

@Injectable({
    providedIn: "root",
})
export class CustomFilterState {
    public localStorage = inject(LocalStorageService);

    private _filters$ = new BehaviorSubject<FilterDisplay[]>([]);

    public readonly filters$ = this._filters$.asObservable();

    setFilters(filters: FilterDisplay[]) {
        this._filters$.next(filters);
        this.localStorage.setFilters(JSON.stringify(filters));
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

    removeAll() {
        this._filters$.next([]);
        this.localStorage.removeFilters();
    }
}
