import { Component, OnInit, Input, Output, EventEmitter, inject, Inject } from "@angular/core";
import { CommonModule, NgClass } from "@angular/common";
import { Router } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ModalProfile } from "../modal/profile/profile.modal";
import { SnackbarData, SnackbarVariant } from "src/app/types/components";
import {
    MAT_SNACK_BAR_DATA,
    MatSnackBar,
    MatSnackBarAction,
    MatSnackBarActions,
    MatSnackBarLabel,
    MatSnackBarRef,
} from "@angular/material/snack-bar";
import { MatButtonModule } from "@angular/material/button";

@Component({
    selector: "custom-snackbar",
    templateUrl: "./custom-snackbar.component.html",
    styleUrls: ["./custom-snackbar.component.css"],
    standalone: true,
})
export class CustomSnackbarComponent {
    private _snackBar = inject(MatSnackBar);

    ngOnInit() {}

    openSnackBar(message: string, variant?: SnackbarVariant, action?: () => void) {
        this._snackBar.openFromComponent(CustomSnackbarComponent, {
            data: {
                message: message,
                variant: variant,
                action: action ? action() : () => {},
            },
            duration: 3000,
        });
    }
}

@Component({
    selector: "custom-snackbar-template",
    templateUrl: "custom-snackbar-template.component.html",
    styleUrls: ["./custom-snackbar.component.css"],
    standalone: true,
    imports: [MatButtonModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction, NgClass],
})
export class PizzaPartyAnnotatedComponent {
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackbarData;
    snackBarRef = inject(MatSnackBarRef);
}
