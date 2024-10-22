import { CommonModule } from "@angular/common";
import { Component, inject, ViewChild, ViewContainerRef } from "@angular/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule, MatIconButton } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { BehaviorSubject, debounceTime, distinctUntilChanged } from "rxjs";
import { ServiceBill } from "src/app/services/bill.service";
import { BankState } from "src/app/core/subjects/subjects.bank";
import { CategoryState } from "src/app/core/subjects/subjects.category";
import { CompanyState } from "src/app/core/subjects/subjects.company";
import { CreditCardState } from "src/app/core/subjects/subjects.credit-card";
import { FilterDisplay } from "src/app/core/types/components";
import { ColorPipe } from "src/utils/pipes/colors";
import { SectorPipe } from "src/utils/pipes/sector";
import { ROUTES } from "src/utils/route";
import { removeDiacritics } from "src/utils/validators";
import { RouteItemType, RoutesType } from "../../types/general";
import { PagePipe } from "src/utils/pipes/page";
import { Dialog } from "@angular/cdk/dialog";
import { ModalNewBank } from "src/app/components/modal/new-bank/new-bank.modal";
import { ModalNewBill } from "src/app/components/modal/new-bill/new-bill.modal";
import { ModalNewCreditCard } from "src/app/components/modal/new-credit-card/new-credit-card.modal";
import { ModalNewCompany } from "src/app/components/modal/new-company/new-company.modal";
import { ModalNewCategory } from "src/app/components/modal/new-category/new-category.modal";

@Component({
    standalone: true,
    selector: "header-layout",
    templateUrl: "./header.layout.component.html",
    styleUrls: ["./header.layout.component.css"],
    imports: [
        CommonModule,
        ColorPipe,
        PagePipe,
        SectorPipe,
        MatInputModule,
        MatIconModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatIconButton,
    ],
})
export class HeaderLayoutComponent {
    @ViewChild("action", { read: ViewContainerRef }) action: ViewContainerRef;
    public creditCards = inject(CreditCardState);
    public categories = inject(CategoryState);
    public banks = inject(BankState);
    public companies = inject(CompanyState);
    public billService = inject(ServiceBill);
    public dialog = inject(Dialog);

    public search$ = new BehaviorSubject<string>("");
    public actualPage: string;
    public screen: RouteItemType | undefined;
    public style = getComputedStyle(document.body);
    public primaryColor = this.style.getPropertyValue("--secondary");
    public backgroundColor = this.style.getPropertyValue("--background");
    public filteredOptions: any[] = [];

    constructor() {
        this.search$
            .pipe(debounceTime(300), distinctUntilChanged())
            .subscribe((value) => {
                this.creditCardSubscriber(value);
                this.categoriesSubscriber(value);
                this.banksSubscriber(value);
                this.companySubscriber(value);
                this.billSubscriber(value);
            });
    }

    creditCardSubscriber(term: string) {
        this.creditCards.creditCards$.subscribe({
            next: (ccs) => {
                this.filteredOptions = [
                    ...(term === "" || term.length < 2
                        ? []
                        : ccs.filter((cc) =>
                              removeDiacritics(cc.name).includes(removeDiacritics(term))
                          )
                    ).map((cc) => ({ ...cc, sector: "credit-card" })),
                ];
            },
        });
    }

    categoriesSubscriber(term: string) {
        this.categories.categories$.subscribe({
            next: (cats) => {
                this.filteredOptions = [
                    ...this.filteredOptions,
                    ...(term === "" || term.length < 2
                        ? []
                        : cats.filter((cat) =>
                              removeDiacritics(cat.name).includes(removeDiacritics(term))
                          )
                    ).map((cat) => ({ ...cat, sector: "category" })),
                ];
            },
        });
    }

    banksSubscriber(term: string) {
        this.banks.banks$.subscribe({
            next: (banks) => {
                this.filteredOptions = [
                    ...this.filteredOptions,
                    ...(term === "" || term.length < 2
                        ? []
                        : banks.filter((bank) =>
                              removeDiacritics(bank.name).includes(removeDiacritics(term))
                          )
                    ).map((bank) => ({ ...bank, sector: "bank" })),
                ];
            },
        });
    }

    companySubscriber(term: string) {
        this.companies.company$.subscribe({
            next: (companies) => {
                this.filteredOptions = [
                    ...this.filteredOptions,
                    ...(term === "" || term.length < 2
                        ? []
                        : companies.filter((company) =>
                              removeDiacritics(company.name).includes(
                                  removeDiacritics(term)
                              )
                          )
                    ).map((company) => ({ ...company, sector: "company" })),
                ];
            },
        });
    }

    billSubscriber(term: string) {
        const filter: FilterDisplay[] = [
            {
                id: term,
                identifier: "name",
                name: term,
            },
        ];
        this.billService
            .getBills(1, 25, filter)
            .pipe(debounceTime(300), distinctUntilChanged())
            .subscribe({
                next: (bills) => {
                    this.filteredOptions = [
                        ...this.filteredOptions,
                        ...(term === "" || term.length < 2 ? [] : bills.data).map(
                            (bill) => ({
                                ...bill,
                                sector: "bill",
                            })
                        ),
                    ];
                },
            });
    }

    ngOnInit() {
        this.actualPage = window.location.pathname;
        this.screen = ROUTES.find((r) => {
            return r.page === window.location.pathname;
        });
    }

    onType(e: Event) {
        const term = (<HTMLTextAreaElement>e.target).value;
        this.search$.next(term);
    }

    onSelect(e: any) {
        console.log(e);
    }

    getOptionName(option: any) {
        return option.name;
    }

    getPageObject() {
        this.actualPage = window.location.pathname;
        this.screen = ROUTES.find((r) => {
            return r.page === window.location.pathname;
        });
        return this.screen;
    }

    openModal() {
        let options = {
            data: {
                header: "new" + (this.screen?.title || "").substring(-1),
                size: "md",
            },
            hasBackdrop: true,
            backdropClass: "modal-backdrop",
        };
        switch (this.actualPage as RoutesType) {
            case "/bills":
                this.dialog.open(ModalNewBill, options);
                break;
            case "/banks":
                this.dialog.open(ModalNewBank, options);
                break;
            case "/credit-cards":
                this.dialog.open(ModalNewCreditCard, options);
                break;
            case "/companies":
                this.dialog.open(ModalNewCompany, options);
                break;
            case "/categories":
                this.dialog.open(ModalNewCategory, options);
                break;
            default:
                return;
        }
    }

    ngOnDestroy() {
        this.search$.unsubscribe();
    }
}
