import {
    Component,
    HostListener,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChild,
    inject,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { ModalProfile } from "src/app/components/modal/profile/profile.modal";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { ModalComponent } from "src/app/components/modal/modal.component";
import { MatIconModule } from "@angular/material/icon";
import { ServiceBill } from "src/app/services/bill.service";
import { BillState } from "src/app/core/subjects/subjects.bill";
import { ServiceBank } from "src/app/services/bank.service";
import { BankState } from "src/app/core/subjects/subjects.bank";
import { CompanyState } from "src/app/core/subjects/subjects.company";
import { ServiceCompany } from "src/app/services/company.service";
import { CustomSnackbarComponent } from "src/app/components/custom-snackbar/custom-snackbar.component";
import { ServiceCreditCard } from "src/app/services/credit-card.service";
import { CreditCardState } from "src/app/core/subjects/subjects.credit-card";
import { ServiceCategory } from "src/app/services/category.service";
import { CategoryState } from "src/app/core/subjects/subjects.category";
import { CommonModule } from "@angular/common";
import { RouteItemType, RoutesType } from "src/app/core/types/general";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { MatSidenavModule } from "@angular/material/sidenav";
import { ItemLayoutComponent } from "./item/item.layout.component";
import { ROUTES } from "src/utils/route";
import { HeaderLayoutComponent } from "./header/header.layout.component";
import { GeneralService } from "src/app/services/general.service";

@Component({
    standalone: true,
    selector: "app-layout",
    templateUrl: "./layout.component.html",
    styleUrls: ["./layout.component.css", "./item/item.layout.component.css"],
    imports: [
        MatIconModule,
        RouterModule,
        CommonModule,
        MatSidenavModule,
        ItemLayoutComponent,
        HeaderLayoutComponent,
    ],
})
export class LayoutComponent implements OnChanges {
    @ViewChild(ModalComponent) modal: any;
    @ViewChild(ModalProfile) profile: any;
    @Input() theme: string | null;

    constructor() {}

    public generalState = inject(GeneralState);
    private generalService = inject(GeneralService);

    public storage = inject(LocalStorageService);
    private snack = inject(CustomSnackbarComponent);

    public billApi = inject(ServiceBill);
    public billState = inject(BillState);

    public bankApi = inject(ServiceBank);
    public bankState = inject(BankState);

    public compApi = inject(ServiceCompany);
    public compState = inject(CompanyState);

    public ccApi = inject(ServiceCreditCard);
    public ccState = inject(CreditCardState);

    public catApi = inject(ServiceCategory);
    public catState = inject(CategoryState);

    public innerWidth: number;
    public themeUsed: string | null;

    onChangeRoute(route: RoutesType) {
        this.generalService.navigateTo(route);
    }

    items: RouteItemType[] = ROUTES;

    @HostListener("window:resize", [])
    onResize() {
        this.innerWidth = window.innerWidth;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["themeUsed"]) {
            this.themeUsed = changes["themeUsed"].currentValue;
        }
    }

    ngOnInit() {
        this.generalState.changePage(window.location.pathname);
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
                this.bankState.setBanks(
                    banks.sort((bank1, bank2) => (bank1.name > bank2.name ? 1 : -1))
                );
                this.bankState.changeVariant(banks.length > 0 ? "none" : "empty");
            },
            error: () => this.bankState.changeStatus("http", "error fetching banks"),
        });

        this.catApi.getCategories().subscribe({
            next: (cats) => {
                this.catState.setCategory(
                    cats.sort((cat1, cat2) => (cat1.name > cat2.name ? 1 : -1))
                );
                this.catState.changeVariant(cats.length > 0 ? "none" : "empty");
            },
            error: () => this.catState.changeStatus("http", "error fetching categories"),
        });

        this.compApi.getCompanies().subscribe({
            next: (comps) => {
                this.compState.setCompanies(
                    comps.sort((comp1, comp2) => (comp1.name > comp2.name ? 1 : -1))
                );
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

    onLogout() {
        this.storage.removeUser();
        this.modal.close();
        this.profile.update();
    }
}
