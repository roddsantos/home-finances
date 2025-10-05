import { inject, Injectable } from "@angular/core";
import { RoutesType, ThemeType } from "src/app/core/types/general";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { Router } from "@angular/router";
import { ComponentType } from "@angular/cdk/portal";
import { Dialog } from "@angular/cdk/dialog";

@Injectable({
    providedIn: "root",
})
export class GeneralService {
    private generalState = inject(GeneralState);
    public dialog = inject(Dialog);
    private router = inject(Router);

    navigateTo(route: RoutesType) {
        this.generalState.changePage(route);
        this.router.navigate([route]);
    }

    setTheme(theme: ThemeType) {
        this.generalState.changeTheme(theme);
        localStorage.setItem("theme", theme);
    }

    changeVisualization(view: "grid" | "list") {
        localStorage.setItem("bills-view", view);
        this.generalState.changeBillsLayout(view);
    }
}
