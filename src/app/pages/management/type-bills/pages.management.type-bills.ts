import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { CustomSnackbarComponent } from "src/app/components/custom-snackbar/custom-snackbar.component";
import { FeedbackContainerComponent } from "src/app/components/feedback-container/feedback-container.component";
import { LocalStorageService } from "src/app/services/services.local-storage";
import { ServiceTypeBill } from "src/app/services/services.type-bill";
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

    typeObject: FeedbackInfo = {
        variant: "loading",
        title: "no type bills",
        actionLabel: "reload",
        action: () => this.onReload(),
    };

    getTypeBills(reloaded?: boolean) {
        this.typebillApi.getTypeBills().subscribe({
            next: (data) => {
                this.tbState.setTypeBill(data as TypeBill[]);
                this.typeObject.variant =
                    (data as TypeBill[]).length === 0 ? "empty" : "none";
            },
            error: () => {
                if (reloaded) this.snack.openSnackBar("Error fetching banks", "error");
                this.tbState.changeStatus("error");
                this.typeObject.variant = "error";
            },
        });
    }

    ngOnInit() {}

    onReload() {
        this.typeObject.variant = "loading";
        this.getTypeBills(true);
    }
}
