import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { CustomSnackbarComponent } from "src/app/components/custom-snackbar/custom-snackbar.component";
import { FeedbackContainerComponent } from "src/app/components/feedback-container/feedback-container.component";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { ServiceTypeBill } from "src/app/services/type-bill.service";
import { FeedbackInfo } from "src/app/types/components";
import { TypeBillState } from "src/app/subjects/subjects.type-bills";
import { TypeBill } from "src/app/types/objects";

@Component({
    selector: "management-type-bills",
    templateUrl: "./pages.management.type-bills.html",
    styleUrls: ["./pages.management.type-bills.css"],
    standalone: true,
    imports: [MatIcon, MatButton, FeedbackContainerComponent, CommonModule],
})
export class TypeBillsManagementComponent {
    public typebillApi = inject(ServiceTypeBill);
    public tbState = inject(TypeBillState);
    public storage = inject(LocalStorageService);
    private snack = inject(CustomSnackbarComponent);

    getTypeBills(reloaded?: boolean) {
        this.typebillApi.getTypeBills().subscribe({
            next: (data) => {
                this.tbState.setTypeBill(data as TypeBill[]);
                this.tbState.changeStatus(
                    (data as TypeBill[]).length === 0 ? "empty" : "none",
                    "no companies"
                );
            },
            error: () => {
                if (reloaded)
                    this.snack.openSnackBar("error fetching bills type", "error");
                this.tbState.changeStatus("error", "error fetching bills type");
            },
        });
    }

    ngOnInit() {
        this.tbState.setAction(() => this.onReload());
    }

    onReload() {
        this.tbState.changeStatus("loading", "loading");
        this.getTypeBills(true);
    }
}
