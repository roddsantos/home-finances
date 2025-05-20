import { CommonModule } from "@angular/common";
import { Component, inject, ViewChild, ViewContainerRef } from "@angular/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule, MatIconButton } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import {
    BehaviorSubject,
    debounceTime,
    distinctUntilChanged,
    Observable,
    Subscription,
} from "rxjs";
import { ServiceBill } from "src/app/services/bill.service";
import { BankState } from "src/app/core/subjects/subjects.bank";
import { CategoryState } from "src/app/core/subjects/subjects.category";
import { CompanyState } from "src/app/core/subjects/subjects.company";
import { CreditCardState } from "src/app/core/subjects/subjects.credit-card";
import { FilterDisplay } from "src/app/core/types/components";
import { SectorPipe } from "src/utils/pipes/sector";
import { ROUTES } from "src/utils/route";
import { removeDiacritics } from "src/utils/validators";
import { RouteItemActionType, RouteItemType, RoutesType } from "../../types/general";
import { PagePipe } from "src/utils/pipes/page";
import { Dialog } from "@angular/cdk/dialog";
import { ModalNewBank } from "src/app/components/modal/new-bank/new-bank.modal";
import { ModalNewBill } from "src/app/components/modal/new-bill/new-bill.modal";
import { ModalNewCreditCard } from "src/app/components/modal/new-credit-card/new-credit-card.modal";
import { ModalNewCompany } from "src/app/components/modal/new-company/new-company.modal";
import { ModalNewCategory } from "src/app/components/modal/new-category/new-category.modal";
import { ModalViewItem } from "src/app/components/modal/view-item/view-item.modal";
import { GeneralState } from "../../subjects/subjects.general";
import { ModalNewSaving } from "src/app/components/modal/new-saving/new-saving.modal";

@Component({
    standalone: true,
    selector: "header-layout",
    templateUrl: "./header.layout.component.html",
    styleUrls: ["./header.layout.component.css"],
    imports: [
        CommonModule,
        SectorPipe,
        MatInputModule,
        MatIconModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatIconButton,
    ],
    providers: [PagePipe],
})
export class HeaderLayoutComponent {
    @ViewChild("action", { read: ViewContainerRef }) action: ViewContainerRef;
    public creditCards = inject(CreditCardState);
    public categories = inject(CategoryState);
    public banks = inject(BankState);
    public companies = inject(CompanyState);
    public generalState = inject(GeneralState);
    public billService = inject(ServiceBill);
    public dialog = inject(Dialog);
    public pagePipe = inject(PagePipe);

    public search$ = new BehaviorSubject<string>("");
    public actualPage: string;
    public screen: RouteItemType | undefined;
    public style = getComputedStyle(document.body);
    public primaryColor = this.style.getPropertyValue("--secondary");
    public backgroundColor = this.style.getPropertyValue("--background");
    public filteredOptions: any[] = [];

    public page$: Subscription;
    public creditCard$: Subscription;
    public categories$: Subscription;
    public banks$: Subscription;
    public company$: Subscription;
    public bill$: Subscription;

    constructor() {
        this.search$
            .pipe(debounceTime(300), distinctUntilChanged())
            .subscribe((value) => {
                if (value.length > 1) {
                    this.creditCardSubscriber(value);
                    this.categoriesSubscriber(value);
                    this.banksSubscriber(value);
                    this.companySubscriber(value);
                    this.billSubscriber(value);
                }
            });
    }

    creditCardSubscriber(term: string) {
        this.creditCard$ = this.creditCards.creditCards$.subscribe({
            next: (ccs) => {
                this.filteredOptions = [
                    ...(term === "" || term.length < 2
                        ? []
                        : ccs.filter((cc) =>
                              removeDiacritics(cc.name).includes(removeDiacritics(term))
                          )),
                ];
            },
        });
    }

    categoriesSubscriber(term: string) {
        this.categories$ = this.categories.categories$.subscribe({
            next: (cats) => {
                this.filteredOptions = [
                    ...this.filteredOptions,
                    ...(term === "" || term.length < 2
                        ? []
                        : cats.filter((cat) =>
                              removeDiacritics(cat.name).includes(removeDiacritics(term))
                          )),
                ];
            },
        });
    }

    banksSubscriber(term: string) {
        this.banks$ = this.banks.banks$.subscribe({
            next: (banks) => {
                this.filteredOptions = [
                    ...this.filteredOptions,
                    ...(term === "" || term.length < 2
                        ? []
                        : banks.filter((bank) =>
                              removeDiacritics(bank.name).includes(removeDiacritics(term))
                          )),
                ];
            },
        });
    }

    companySubscriber(term: string) {
        this.company$ = this.companies.company$.subscribe({
            next: (companies) => {
                this.filteredOptions = [
                    ...this.filteredOptions,
                    ...(term === "" || term.length < 2
                        ? []
                        : companies.filter((company) =>
                              removeDiacritics(company.name).includes(
                                  removeDiacritics(term)
                              )
                          )),
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
        this.bill$ = this.billService
            .getBills(1, 25, filter)
            .pipe(debounceTime(300), distinctUntilChanged())
            .subscribe({
                next: (bills) => {
                    this.filteredOptions = [
                        ...this.filteredOptions,
                        ...(term === "" || term.length < 2 ? [] : bills.data),
                    ];
                },
            });
    }

    ngOnInit() {
        this.actualPage = window.location.pathname;
        this.page$ = this.generalState.page$.subscribe({
            next: (page) => {
                this.screen = ROUTES.find((route) => {
                    return route.page === page;
                });
            },
        });
    }

    onTypeSearch(e: Event) {
        const term = (<HTMLTextAreaElement>e.target).value.trim();
        this.search$.next(term);
    }

    onClearSearch() {
        this.search$.next("");
    }

    onSelect(e: any) {
        const option = {
            data: {
                item: e,
                size: "md",
            },
        };
        this.dialog.open(ModalViewItem, option);
    }

    getOptionName(option: any) {
        return option.name;
    }

    openModal(selectedEvent: RouteItemActionType) {
        let options = {
            data: {
                header: selectedEvent.title,
                size: "md",
            },
            hasBackdrop: true,
            backdropClass: "modal-backdrop",
        };
        switch (this.screen?.page) {
            case "/bills":
                this.dialog.open(ModalNewBill, options);
                break;
            case "/banks":
                if (selectedEvent.event === "creating")
                    this.dialog.open(ModalNewBank, options);
                else this.dialog.open(ModalNewSaving, options);
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
        this.page$.unsubscribe();
        this.creditCard$.unsubscribe();
        this.company$.unsubscribe();
        this.banks$.unsubscribe();
        this.categories$.unsubscribe();
        this.bill$.unsubscribe();
    }
}
