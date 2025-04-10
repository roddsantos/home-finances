import { inject, Injectable } from "@angular/core";
import { RoutesType, ThemeType } from "src/app/core/types/general";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { Router } from "@angular/router";

@Injectable({
    providedIn: "root",
})
export class GeneralService {
    private generalState = inject(GeneralState);
    private router = inject(Router);

    navigateTo(route: RoutesType) {
        this.generalState.changePage(route);
        this.router.navigate([route]);
    }

    setTheme(theme: ThemeType) {
        this.generalState.changeTheme(theme);
        localStorage.setItem("theme", theme);
    }
}
