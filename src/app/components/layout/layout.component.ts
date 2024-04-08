import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit, Inject, Input, inject } from "@angular/core";
import { Router } from "@angular/router";
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { ModalProfile } from "../modal/profile/profile.modal";
import { AppService } from "src/app/app.service";
import { Subject, takeUntil } from "rxjs";
import { LocalStorageService } from "src/app/services/services.local-storage";
import { ModalComponent } from "../modal/modal.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { ProfileDialogType } from "src/app/types/modal";
import { Dialog } from "@angular/cdk/dialog";
import { Overlay, OverlayConfig } from "@angular/cdk/overlay";

@Component({
    standalone: true,
    selector: "app-layout",
    templateUrl: "./layout.component.html",
    styleUrls: ["./layout.component.css"],
    imports: [MatToolbarModule, MatIconModule, ModalComponent, ModalProfile],
})
export class LayoutComponent implements AfterViewInit {
    @ViewChild(ModalComponent) modal: any;
    @ViewChild(ModalProfile) profile: any;

    private router = inject(Router);
    private appService = inject(AppService);
    private storage = inject(LocalStorageService);
    public dialog = inject(Dialog);
    public overlay = inject(Overlay);

    ngOnInit() {}

    openProfile(): void {
        const dialogRef = this.dialog.open<string>(ModalProfile, {
            width: "250px",
            data: {
                header: "perfil",
                username: "a",
            },
            hasBackdrop: true,
            backdropClass: "modal-backdrop",
        });

        dialogRef.closed.subscribe((result) => {
            console.log("The dialog was closed");
        });
    }

    onHomeClick() {
        this.router.navigate([""]);
    }
    onManagementClick() {
        this.router.navigate(["management"]);
    }
    onMonthlyClick() {
        this.router.navigate(["monthly"]);
    }
    onDashboardClick() {
        this.router.navigate(["dashboard"]);
    }

    toggleDarkMode() {
        document.body.classList.toggle("dark-theme");
    }

    onLogout() {
        this.storage.removeUser();
        this.modal.close();
        this.profile.update();
    }

    ngAfterViewInit() {}
}
