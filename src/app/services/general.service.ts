import { inject, Injectable } from "@angular/core";
import { RoutesType } from "src/app/core/types/general";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { Router } from "@angular/router";
import { ComponentType } from "@angular/cdk/portal";
import { Dialog } from "@angular/cdk/dialog";
import { CustomSnackbarComponent } from "../components/custom-snackbar/custom-snackbar.component";

@Injectable({
    providedIn: "root",
})
export class GeneralService {
    public snack = inject(CustomSnackbarComponent);
    private generalState = inject(GeneralState);
    public dialog = inject(Dialog);
    private router = inject(Router);

    navigateTo(route: RoutesType) {
        this.generalState.changePage(route);
        this.router.navigate([route]);
    }

    setTheme(theme: string) {
        this.generalState.changeTheme(theme);
        localStorage.setItem("theme", theme);
    }

    changeVisualization(view: "grid" | "list") {
        localStorage.setItem("bills-view", view);
        this.generalState.changeBillsLayout(view);
    }

    successSnackbar(message: string) {
        this.snack.openSnackBar(message, "success");
    }

    errorSnackbar(message: string) {
        this.snack.openSnackBar(message, "error");
    }

    infoSnackbar(message: string) {
        this.snack.openSnackBar(message, "info");
    }

    warningSnackbar(message: string) {
        this.snack.openSnackBar(message, "warning");
    }
}
