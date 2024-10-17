import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatIconButton } from "@angular/material/button";
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

@Component({
    standalone: true,
    selector: "header-layout",
    templateUrl: "./header.layout.component.html",
    styleUrls: ["./header.layout.component.css"],
    imports: [
        CommonModule,
        ColorPipe,
        SectorPipe,
        MatInputModule,
        MatIconModule,
        MatAutocompleteModule,
        MatIconButton,
    ],
})
export class HeaderLayoutComponent {
    public creditCards = inject(CreditCardState);
    public categories = inject(CategoryState);
    public banks = inject(BankState);
    public companies = inject(CompanyState);
    public billService = inject(ServiceBill);

    public search$ = new BehaviorSubject<string>("");
    public actualPage: string;
    public page = ROUTES.find((r) => {
        return r.page === this.actualPage;
    });
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

    ngOnDestroy() {
        this.search$.unsubscribe();
    }
}
