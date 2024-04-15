import { NgFor, NgIf } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { TypeBillsService } from "src/app/api/api.type-bills";
import { CustomSnackbarComponent } from "src/app/components/custom-snackbar/custom-snackbar.component";
import { FeedbackContainerComponent } from "src/app/components/feedback-container/feedback-container.component";
import { LocalStorageService } from "src/app/services/services.local-storage";
import { FeedbackInfo } from "src/app/types/components";
import { COMPANIES } from "src/utils/data";

@Component({
    selector: "management-type-bills",
    templateUrl: "./pages.management.type-bills.html",
    styleUrls: ["./pages.management.type-bills.css"],
    standalone: true,
    imports: [MatIcon, MatButton, NgFor, NgIf, FeedbackContainerComponent],
})
export class TypeBillsManagementComponent {
    public typebillApi = inject(TypeBillsService);
    public storage = inject(LocalStorageService);
    private snack = inject(CustomSnackbarComponent);

    typeBills: Array<any>;
    loading: boolean = false;

    typeObject: FeedbackInfo = {
        title: "no type bills",
        actionLabel: "reload",
        action: () => this.onReload(),
        loading: this.loading,
    };

    ngOnInit() {
        let str = localStorage.getItem("typeBills");
        if (str) {
            this.typeBills = JSON.parse(str);
        } else this.typeBills = [];
    }

    onReload() {
        this.loading = true;
        this.typebillApi.getTypeBills().subscribe({
            next: (data) => {
                if (data) {
                    let res = JSON.stringify(data);
                    this.storage.setTypeBills(res);
                }
            },
            error: () => {
                this.snack.openSnackBar("error fetching type bills", "error");
            },
            complete: () => {
                this.loading = false;
            },
        });
    }
}
