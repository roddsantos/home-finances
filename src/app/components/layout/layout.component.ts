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
import {
    Bank,
    Bill,
    BillData,
    Company,
    CreditCard,
    TypeBill,
} from "src/app/types/objects";
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
        this.billApi.getBills({ limit: 10, page: 1 }).subscribe({
            next: (data) => this.billState.setBills(data as Array<Bill & BillData>),
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
                if (!user) this.snack.openSnackBar("Error fetching banks", "error");
                else {
                    this.bankState.setBanks(banks as Bank[]);
                    this.bankState.changeStatus(
                        (banks as Bank[]).length > 0 ? "data" : "empty"
                    );
                    this.compState.setCompanies(comps as Company[]);
                    this.compState.changeStatus(
                        (comps as Company[]).length > 0 ? "data" : "empty"
                    );
                    this.ccState.setCreditCards(ccs as CreditCard[]);
                    this.ccState.changeStatus(
                        (ccs as CreditCard[]).length > 0 ? "data" : "empty"
                    );
                }
            },
            error: (err: HttpErrorResponse) => {
                console.log(err);
                if (err.url?.includes("4001/bill") || err.status === 0)
                    this.billState.changeStatus("error");
                if (err.url?.includes("4001/company") || err.status === 0)
                    this.compState.changeStatus("error");
                if (err.url?.includes("4001/bank") || err.status === 0)
                    this.bankState.changeStatus("error");
                if (err.url?.includes("4001/credit-card") || err.status === 0)
                    this.ccState.changeStatus("error");
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
