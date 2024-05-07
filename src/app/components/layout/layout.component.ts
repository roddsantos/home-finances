import { Component, ViewChild, AfterViewInit, inject } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { ModalProfile } from "../modal/profile/profile.modal";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { ModalComponent } from "../modal/modal.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { Dialog } from "@angular/cdk/dialog";
import { Overlay } from "@angular/cdk/overlay";
import { ServiceBill } from "src/app/services/bill.service";
import { BillState } from "src/app/subjects/subjects.bill";
import { ServiceBank } from "src/app/services/bank.service";
import { UserState } from "src/app/subjects/subjects.user";
import { BankState } from "src/app/subjects/subjects.bank";
import { CompanyState } from "src/app/subjects/subjects.company";
import { ServiceCompany } from "src/app/services/company.service";
import { CustomSnackbarComponent } from "../custom-snackbar/custom-snackbar.component";
import { HttpErrorResponse } from "@angular/common/http";
import { ServiceCreditCard } from "src/app/services/credit-card.service";
import { CreditCardState } from "src/app/subjects/subjects.credit-card";
import { ServiceCategory } from "src/app/services/category.service";
import { CategoryState } from "src/app/subjects/subjects.category";
import { CustomFilterState } from "../custom-filter/custom-filter.subjects.component";
import { FetchPaginatedData } from "src/app/types/services";
import { allSettledFork } from "src/utils/observers";

@Component({
    standalone: true,
    selector: "app-layout",
    templateUrl: "./layout.component.html",
    styleUrls: ["./layout.component.css"],
    imports: [
        MatToolbarModule,
        MatIconModule,
        ModalComponent,
        ModalProfile,
        RouterModule,
    ],
})
export class LayoutComponent implements AfterViewInit {
    @ViewChild(ModalComponent) modal: any;
    @ViewChild(ModalProfile) profile: any;

    private router = inject(Router);
    private storage = inject(LocalStorageService);
    public dialog = inject(Dialog);
    public overlay = inject(Overlay);
    private snack = inject(CustomSnackbarComponent);
    public filtersState = inject(CustomFilterState);

    public billApi = inject(ServiceBill);
    public billState = inject(BillState);

    public bankApi = inject(ServiceBank);
    public userState = inject(UserState);
    public bankState = inject(BankState);

    public compApi = inject(ServiceCompany);
    public compState = inject(CompanyState);

    public ccApi = inject(ServiceCreditCard);
    public ccState = inject(CreditCardState);

    public catApi = inject(ServiceCategory);
    public catState = inject(CategoryState);

    ngOnInit() {
        this.billApi.getBills().subscribe({
            next: (bills) => {
                if (bills.count === 0) this.billState.changeStatus("empty", "no bills");
                else this.billState.setBills(bills);
            },
            error: () => {
                this.snack.openSnackBar("error fetching bills", "error");
                this.billState.changeStatus("error", "error fetching bills");
            },
        });

        this.bankApi.getBanks().subscribe({
            next: (banks) => {
                this.bankState.setBanks(banks);
                this.bankState.changeVariant(banks.length > 0 ? "none" : "empty");
            },
            error: () => this.bankState.changeStatus("http", "error fetching banks"),
        });

        this.catApi.getCategories().subscribe({
            next: (cats) => {
                this.catState.setCategory(cats);
                this.catState.changeVariant(cats.length > 0 ? "none" : "empty");
            },
            error: () => this.catState.changeStatus("http", "error fetching categories"),
        });

        this.compApi.getCompanies().subscribe({
            next: (comps) => {
                this.compState.setCompanies(comps);
                this.compState.changeVariant(comps.length > 0 ? "none" : "empty");
            },
            error: () => this.compState.changeStatus("http", "error fetching companies"),
        });

        this.ccApi.getCreditCards({}).subscribe({
            next: (ccs) => {
                this.ccState.setCreditCards(ccs);
                this.ccState.changeVariant(ccs.length > 0 ? "none" : "empty");
            },
            error: () => this.ccState.changeStatus("http", "error fetching credit cards"),
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
