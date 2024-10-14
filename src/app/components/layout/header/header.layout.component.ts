import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatIconButton } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { BehaviorSubject, debounceTime, distinctUntilChanged } from "rxjs";
import { CategoryState } from "src/app/subjects/subjects.category";
import { CreditCardState } from "src/app/subjects/subjects.credit-card";
import { ColorPipe } from "src/utils/pipes/colors";
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
        MatInputModule,
        MatIconModule,
        MatAutocompleteModule,
        MatIconButton,
    ],
})
export class HeaderLayoutComponent {
    public creditCards = inject(CreditCardState);
    public categories = inject(CategoryState);

    public search$ = new BehaviorSubject<string>("");
    public actualPage: string;
    public page = ROUTES.find((r) => {
        return r.page === this.actualPage;
    });
    public style = getComputedStyle(document.body);
    public primaryColor = this.style.getPropertyValue("--secondary");
    public backgroundColor = this.style.getPropertyValue("--background");
    public filteredOptions: any[];

    constructor() {
        this.search$
            .pipe(debounceTime(300), distinctUntilChanged())
            .subscribe((value) => {
                this.creditCards.creditCards$.subscribe({
                    next: (ccs) => {
                        this.filteredOptions = [
                            ...(value === "" || value.length < 2
                                ? []
                                : ccs.filter((cc) =>
                                      removeDiacritics(cc.name).includes(
                                          removeDiacritics(value)
                                      )
                                  )
                            ).map((cc) => ({ ...cc, sector: "credit-card" })),
                        ];
                    },
                });
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
