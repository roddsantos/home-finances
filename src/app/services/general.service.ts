import { inject, Injectable } from "@angular/core";
import { RoutesType } from "src/app/core/types/general";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { Router } from "@angular/router";
import { Dialog } from "@angular/cdk/dialog";
import { CustomSnackbarComponent } from "../components/custom-snackbar/custom-snackbar.component";
import { HttpClient } from "@angular/common/http";
import { UserState } from "../core/subjects/subjects.user";
import { LocalStorageService } from "./local-storage.service";

@Injectable({
    providedIn: "root",
})
export class GeneralService {
    private snack = inject(CustomSnackbarComponent);
    public generalState = inject(GeneralState);
    public localStorageService = inject(LocalStorageService);
    public dialog = inject(Dialog);
    private router = inject(Router);
    public http = inject(HttpClient);
    public user = inject(UserState);

    navigateTo(route: RoutesType) {
        this.generalState.changePage(route);
        this.router.navigate([route]);
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
