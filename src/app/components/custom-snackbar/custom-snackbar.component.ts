import { Component, inject, Injectable } from "@angular/core";
import { NgClass } from "@angular/common";
import { SnackbarData, SnackbarVariant } from "src/app/types/components";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";

@Injectable({
    providedIn: "root",
})
@Component({
    selector: "custom-snackbar",
    templateUrl: "./custom-snackbar.component.html",
    styleUrls: ["./custom-snackbar.component.css"],
    standalone: true,
    imports: [NgClass],
})
export class CustomSnackbarComponent {
    private _snackBar = inject(MatSnackBar);

    snackData: SnackbarData = {
        variant: "default",
        message: "",
        options: {},
        actionLabel: "",
        action: () => {},
    };

    ngOnInit() {}

    openSnackBar(
        message: string,
        variant?: SnackbarVariant,
        actionLabel?: string,
        action?: SnackbarData["action"],
        options?: MatSnackBarConfig<any>
    ) {
        this.snackData = {
            message,
            variant,
            action,
        };
        this._snackBar
            .open(message, actionLabel, {
                panelClass: ["snackbar-container", variant || "default"],
                duration: 3000,
                ...options,
            })
            .afterDismissed()
            .subscribe(() => {
                if (this.snackData.action) this.snackData.action();
            });
    }
}
