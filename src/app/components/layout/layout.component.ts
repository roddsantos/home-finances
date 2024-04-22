import { Component, ViewChild, AfterViewInit, inject } from "@angular/core";
import { Router } from "@angular/router";
import { ModalProfile } from "../modal/profile/profile.modal";
import { LocalStorageService } from "src/app/services/services.local-storage";
import { ModalComponent } from "../modal/modal.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { Dialog } from "@angular/cdk/dialog";
import { Overlay } from "@angular/cdk/overlay";
import { ServiceBill } from "src/app/services/services.bill";
import { BillState } from "src/app/subjects/subjects.bill";
import { Bill } from "src/app/types/objects";

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
    private storage = inject(LocalStorageService);
    public dialog = inject(Dialog);
    public overlay = inject(Overlay);
    public billApi = inject(ServiceBill);
    public billState = inject(BillState);

    ngOnInit() {
        this.billApi.getBills({ limit: 10, page: 1 }).subscribe({
            next: (data) => this.billState.setBills(data as Bill[]),
        });
    }

    openProfile(): void {
        const dialogRef = this.dialog.open<string>(ModalProfile, {
            data: {
                header: "perfil",
                username: "a",
                size: "sm",
            },
            hasBackdrop: true,
            backdropClass: "modal-backdrop",
        });

        dialogRef.closed.subscribe();
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
