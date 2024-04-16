import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { CustomSnackbarComponent } from "src/app/components/custom-snackbar/custom-snackbar.component";
import { FeedbackContainerComponent } from "src/app/components/feedback-container/feedback-container.component";
import { LocalStorageService } from "src/app/services/services.local-storage";
import { ServiceTypeBill } from "src/app/services/services.type-bill";
import { FeedbackInfo } from "src/app/types/components";
import { TypeBillState } from "src/app/subjects/subjects.type-bills";
import { TypeBill } from "src/app/types/general";

@Component({
    selector: "management-type-bills",
    templateUrl: "./pages.management.type-bills.html",
    styleUrls: ["./pages.management.type-bills.css"],
    standalone: true,
    imports: [MatIcon, MatButton, NgFor, NgIf, FeedbackContainerComponent, AsyncPipe],
})
export class TypeBillsManagementComponent {
    public typebillApi = inject(ServiceTypeBill);
    public tbState = inject(TypeBillState);
    public storage = inject(LocalStorageService);
    private snack = inject(CustomSnackbarComponent);

    loading: boolean = false;

    typeObject: FeedbackInfo = {
        title: "no type bills",
        actionLabel: "reload",
        action: () => this.onReload(),
        loading: this.loading,
    };

    getTypeBills(reloaded?: boolean) {
        this.typebillApi.getTypeBills().subscribe({
            next: (data) => {
                this.tbState.setTypeBill(data as TypeBill[]);
            },
            error: () => {
                if (reloaded) this.snack.openSnackBar("Error fetching banks", "error");
                this.tbState.changeStatus("error");
            },
        });
        this.loading = false;
    }

    ngOnInit() {
        this.getTypeBills();
    }

    onReload() {
        this.loading = true;
        this.getTypeBills(true);
    }
}
