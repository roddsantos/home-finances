import {
    Component,
    HostListener,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChild,
    inject,
} from "@angular/core";
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
import { ServiceCreditCard } from "src/app/services/credit-card.service";
import { CreditCardState } from "src/app/subjects/subjects.credit-card";
import { ServiceCategory } from "src/app/services/category.service";
import { CategoryState } from "src/app/subjects/subjects.category";
import { CustomFilterState } from "../custom-filter/custom-filter.subjects.component";
import { CommonModule } from "@angular/common";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { RouteItemType, RoutesType, ThemeType } from "src/app/types/general";
import { GeneralState } from "src/app/subjects/subjects.general";
import { MatSidenavModule } from "@angular/material/sidenav";
import { ItemLayoutComponent } from "./item/item.layout.component";
import { ROUTES } from "src/utils/route";

@Component({
    standalone: true,
    selector: "app-layout",
    templateUrl: "./layout.component.html",
    styleUrls: ["./layout.component.css", "./item/item.layout.component.css"],
    imports: [
        MatToolbarModule,
        MatIconModule,
        ModalComponent,
        ModalProfile,
        RouterModule,
        CommonModule,
        MatTooltipModule,
        MatMenuModule,
        MatButtonModule,
        MatSidenavModule,
        ItemLayoutComponent,
    ],
})
export class LayoutComponent implements OnChanges {
    @ViewChild(ModalComponent) modal: any;
    @ViewChild(ModalProfile) profile: any;
    @Input() theme: string | null;

    public storage = inject(LocalStorageService);
    public dialog = inject(Dialog);
    public overlay = inject(Overlay);
    private snack = inject(CustomSnackbarComponent);
    public filtersState = inject(CustomFilterState);
    public router = inject(Router);

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

    public generalState = inject(GeneralState);
    public innerWidth: number;

    actualPage = window.location.pathname;
    themeUsed: string | null;

    onChangeRoute(route: RoutesType) {
        this.actualPage = route;
        this.router.navigate([route]);
    }

    items: RouteItemType[] = ROUTES;

    @HostListener("window:resize", ["$event"])
    onResize() {
        this.innerWidth = window.innerWidth;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["themeUsed"]) {
            this.themeUsed = changes["themeUsed"].currentValue;
        }
    }

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

    changeLayout(layout: ThemeType) {
        document.body.className = "";
        document.body.className = layout === "default" ? "" : layout;
        this.storage.setTheme(layout);
    }

    onLogout() {
        this.storage.removeUser();
        this.modal.close();
        this.profile.update();
    }
}
