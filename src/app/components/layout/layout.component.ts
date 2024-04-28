import { Component, ViewChild, AfterViewInit, inject } from "@angular/core";
import { Router } from "@angular/router";
import { ModalProfile } from "../modal/profile/profile.modal";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { ModalComponent } from "../modal/modal.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { Dialog } from "@angular/cdk/dialog";
import { Overlay } from "@angular/cdk/overlay";
import { ServiceBill } from "src/app/services/bill.service";
import { BillState } from "src/app/subjects/subjects.bill";
import { Bank, Bill, BillData, Company, CreditCard } from "src/app/types/objects";
import { ServiceBank } from "src/app/services/bank.service";
import { UserState } from "src/app/subjects/subjects.user";
import { BankState } from "src/app/subjects/subjects.bank";
import { zip } from "rxjs";
import { CompanyState } from "src/app/subjects/subjects.company";
import { ServiceCompany } from "src/app/services/company.service";
import { CustomSnackbarComponent } from "../custom-snackbar/custom-snackbar.component";
import { HttpErrorResponse } from "@angular/common/http";
import { ServiceCreditCard } from "src/app/services/credit-card.service";
import { CreditCardState } from "src/app/subjects/subjects.credit-card";
import { ServiceTypeBill } from "src/app/services/type-bill.service";
import { TypeBillState } from "src/app/subjects/subjects.type-bills";
import { CustomFilterState } from "../custom-filter/custom-filter.subjects.component";
import { FetchPaginatedData } from "src/app/types/services";

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

    public typebillApi = inject(ServiceTypeBill);
    public tbState = inject(TypeBillState);

    ngOnInit() {
        this.billApi.getBills().subscribe({
            next: (data) => {
                const result = data as FetchPaginatedData<Bill & BillData>;
                if (result.count === 0) this.billState.changeStatus("empty", "no bills");
                else this.billState.setBills(result.data);
            },
            error: () => {
                this.snack.openSnackBar("error fetching bills", "error");
                this.billState.changeStatus("error", "error fetching bills");
            },
        });

        zip([
            this.userState.user$,
            this.bankApi.getBanks(),
            this.compApi.getCompanies(),
            this.ccApi.getCreditCards({
                limit: 10,
                page: 1,
            }),
        ]).subscribe({
            next: ([user, banks, comps, ccs]) => {
                if (!user) {
                    this.snack.openSnackBar("user not logged", "error");
                    this.compState.changeStatus("http", "user not logged");
                    this.bankState.changeStatus("http", "user not logged");
                    this.ccState.changeStatus("http", "user not logged");
                } else {
                    this.bankState.setBanks(banks as Bank[]);
                    this.bankState.changeVariant(
                        (banks as Bank[]).length > 0 ? "none" : "empty"
                    );
                    this.compState.setCompanies(comps as Company[]);
                    this.compState.changeVariant(
                        (comps as Company[]).length > 0 ? "none" : "empty"
                    );
                    this.ccState.setCreditCards(ccs as CreditCard[]);
                    this.ccState.changeVariant(
                        (ccs as CreditCard[]).length > 0 ? "none" : "empty"
                    );
                }
            },
            error: (err: HttpErrorResponse) => {
                console.log(err.url);
                if (err.message.includes("reading 'id'")) {
                    this.billState.changeStatus("error", "user not logged in");
                    this.compState.changeStatus("error", "user not logged in");
                    this.bankState.changeStatus("error", "user not logged in");
                    this.ccState.changeStatus("error", "user not logged in");
                } else {
                    if (err.url?.includes("4001/bill") || err.status === 0)
                        this.billState.changeStatus("http", "error fetching bills");
                    if (err.url?.includes("4001/company") || err.status === 0)
                        this.compState.changeStatus("http", "error fetching companies");
                    if (err.url?.includes("4001/bank") || err.status === 0)
                        this.bankState.changeStatus("http", "error fetching banks");
                    if (err.url?.includes("4001/credit-card") || err.status === 0)
                        this.ccState.changeStatus("http", "error fetching credit cards");
                }
            },
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
