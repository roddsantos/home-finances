import { AsyncPipe, NgFor, NgIf, NgStyle } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { mergeMap } from "rxjs";
import { CustomSnackbarComponent } from "src/app/components/custom-snackbar/custom-snackbar.component";
import { FeedbackContainerComponent } from "src/app/components/feedback-container/feedback-container.component";
import { ServiceCompany } from "src/app/services/services.company";
import { CompanyState } from "src/app/subjects/subjects.company";
import { UserState } from "src/app/subjects/subjects.user";
import { FeedbackInfo } from "src/app/types/components";
import { Company } from "src/app/types/general";

@Component({
    selector: "management-companies",
    templateUrl: "./pages.management.companies.html",
    styleUrls: ["./pages.management.companies.css"],
    standalone: true,
    imports: [
        MatIcon,
        MatButton,
        NgIf,
        NgFor,
        NgStyle,
        MatIconButton,
        FeedbackContainerComponent,
        AsyncPipe,
    ],
})
export class ManagementCompaniesComponent {
    public compApi = inject(ServiceCompany);
    public compState = inject(CompanyState);
    public userState = inject(UserState);
    private snack = inject(CustomSnackbarComponent);

    typeObject: FeedbackInfo = {
        title: "no companies",
        actionLabel: "reload",
        action: () => this.onReload(),
        loading: true,
    };

    getCompanies(reloaded?: boolean) {
        this.userState.user$.pipe(mergeMap(() => this.compApi.getCompanies())).subscribe({
            next: (comps) => {
                this.compState.setCompanies(comps as Company[]);
            },
            error: () => {
                if (reloaded) this.snack.openSnackBar("Error fetching banks", "error");
                this.compState.changeStatus("error");
            },
        });
        this.typeObject.loading = false;
    }

    ngOnInit() {
        this.typeObject.loading = true;
        this.getCompanies();
    }

    onReload() {
        this.typeObject.loading = true;
        this.getCompanies(true);
    }

    trackCompany(index: number, company: Company) {
        return company.id;
    }
}
