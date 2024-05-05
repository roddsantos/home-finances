import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { mergeMap } from "rxjs";
import { CustomFilterComponent } from "src/app/components/custom-filter/custom-filter.component";
import { CustomSnackbarComponent } from "src/app/components/custom-snackbar/custom-snackbar.component";
import { FeedbackContainerComponent } from "src/app/components/feedback-container/feedback-container.component";
import { ServiceCompany } from "src/app/services/company.service";
import { CompanyState } from "src/app/subjects/subjects.company";
import { UserState } from "src/app/subjects/subjects.user";
import { FeedbackInfo } from "src/app/types/components";
import { Company } from "src/app/types/objects";

@Component({
    selector: "management-companies",
    templateUrl: "./pages.management.companies.html",
    styleUrls: ["./pages.management.companies.css", "../pages.management.css"],
    standalone: true,
    imports: [
        MatIcon,
        MatButton,
        MatIconButton,
        MatTooltipModule,
        FeedbackContainerComponent,
        CommonModule,
        CustomFilterComponent,
    ],
})
export class ManagementCompaniesComponent {
    public compApi = inject(ServiceCompany);
    public compState = inject(CompanyState);
    public userState = inject(UserState);
    private snack = inject(CustomSnackbarComponent);

    getCompanies(reloaded?: boolean) {
        this.userState.user$.pipe(mergeMap(() => this.compApi.getCompanies())).subscribe({
            next: (comps) => {
                this.compState.setCompanies(comps as Company[]);
                this.compState.changeStatus(
                    (comps as Company[]).length === 0 ? "empty" : "none",
                    "no companies"
                );
            },
            error: () => {
                if (reloaded)
                    this.snack.openSnackBar("error fetching companies", "error");
                this.compState.changeStatus("error", "error fetching companies");
            },
        });
    }

    ngOnInit() {
        this.compState.setAction(() => this.onReload());
    }

    onReload() {
        this.compState.changeStatus("loading", "loading");
        this.getCompanies(true);
    }

    trackCompany(index: number, company: Company) {
        return company.id;
    }
}
