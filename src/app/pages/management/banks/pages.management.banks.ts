import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { mergeMap } from "rxjs";
import { CustomSnackbarComponent } from "src/app/components/custom-snackbar/custom-snackbar.component";
import { FeedbackContainerComponent } from "src/app/components/feedback-container/feedback-container.component";
import { ServiceBank } from "src/app/services/bank.service";
import { BankState } from "src/app/subjects/subjects.bank";
import { UserState } from "src/app/subjects/subjects.user";
import { FeedbackInfo } from "src/app/types/components";
import { Bank } from "src/app/types/objects";

@Component({
    selector: "management-banks",
    templateUrl: "./pages.management.banks.html",
    styleUrls: ["./pages.management.banks.css"],
    standalone: true,
    imports: [
        MatIcon,
        MatButton,
        MatIconButton,
        FeedbackContainerComponent,
        CommonModule,
    ],
})
export class BanksManagementComponent {
    public bankApi = inject(ServiceBank);
    public userState = inject(UserState);
    public bankState = inject(BankState);
    private snack = inject(CustomSnackbarComponent);

    typeObject: FeedbackInfo = {
        title: "no banks",
        actionLabel: "reload",
        action: () => this.onReload(),
        variant: "empty",
    };

    getBanks(reloaded?: boolean) {
        this.bankApi.getBanks().subscribe({
            next: (banks) => {
                this.bankState.setBanks(banks as Bank[]);
                this.typeObject.variant =
                    (banks as Bank[]).length === 0 ? "empty" : "loading";
            },
            error: () => {
                if (reloaded) this.snack.openSnackBar("Error fetching banks", "error");
                this.bankState.changeStatus("error");
                this.typeObject.variant = "error";
            },
        });
    }

    ngOnInit() {}

    onReload() {
        this.typeObject.variant = "loading";
        this.getBanks(true);
    }

    trackBank(index: number, bank: Bank) {
        return bank.id;
    }
}
