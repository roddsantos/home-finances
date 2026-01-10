import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ActionsComponent } from "src/app/components/actions/actions.component";
import { CustomSnackbarComponent } from "src/app/components/custom-snackbar/custom-snackbar.component";
import { FeedbackContainerComponent } from "src/app/components/feedback-container/feedback-container.component";
import { CompanyService } from "src/app/services/company.service";
import { CompanyState } from "src/app/core/subjects/subjects.company";
import { UserState } from "src/app/core/subjects/subjects.user";
import { ActionItem } from "src/app/core/types/components";
import { CompanyObjectType } from "src/app/core/types/data/company.type";

@Component({
    selector: "management-companies",
    templateUrl: "./pages.management.companies.html",
    styleUrls: ["./pages.management.companies.css", "../pages.management.css"],
    standalone: true,
    imports: [
        MatTooltipModule,
        FeedbackContainerComponent,
        CommonModule,
        ActionsComponent,
    ],
})
export class ManagementCompaniesComponent {
    public compApi = inject(CompanyService);
    public compState = inject(CompanyState);
    public userState = inject(UserState);
    private snack = inject(CustomSnackbarComponent);

    actions: ActionItem[] = [
        { name: "", icon: "edit", action: () => this.onEdit(), color: "#00328f" },
        {
            name: "",
            icon: "delete",
            action: () => this.onDelete(),
            color: "#8f0000",
        },
    ];

    getCompanies(reloaded?: boolean) {
        this.compApi.getCompanies().subscribe({
            next: (comps) => {
                this.compState.setCompanies(comps as CompanyObjectType[]);
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

    trackCompany(index: number, company: CompanyObjectType) {
        return company.id;
    }

    onEdit() {
        console.log("EDIT");
    }

    onDelete() {
        console.log("DELETE");
    }
}
