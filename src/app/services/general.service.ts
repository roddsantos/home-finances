import { inject, Injectable } from "@angular/core";
import { RoutesType } from "../core/types/general";
import { GeneralState } from "../core/subjects/subjects.general";
import { Router } from "@angular/router";

@Injectable({
    providedIn: "root",
})
export class GeneralService {
    private generalState = inject(GeneralState);
    public router = inject(Router);

    navigateTo(route: RoutesType) {
        this.generalState.changePage(route);
        this.router.navigate([route]);
    }
}
