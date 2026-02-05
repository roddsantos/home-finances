import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule, MatIconButton } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { BehaviorSubject, debounceTime, distinctUntilChanged, Subscription } from "rxjs";
import { SectorPipe } from "src/utils/pipes/sector";
import { ROUTES } from "src/utils/route";
import { RouteItemType } from "../../types/general";
import { PagePipe } from "src/utils/pipes/page";
import { Dialog } from "@angular/cdk/dialog";
import { ModalViewItem } from "src/app/components/modal/view-item/view-item.modal";
import { MatOptionSelectionChange } from "@angular/material/core";
import { HomeService } from "src/app/services/home.service";
import { GeneralComponent } from "../../general/general.component";
import { HomeSearchReturnSectionsType } from "../../types/data/home.types";
import { HOME_SEARCH_INITIALIZER } from "src/utils/constants/home";

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
export class HeaderLayoutComponent extends GeneralComponent {
    public homeService = inject(HomeService);
    public dialog = inject(Dialog);
    public pagePipe = inject(PagePipe);

    public search$ = new BehaviorSubject<string>("");
    public screen: RouteItemType | undefined;
    public sections: Array<keyof HomeSearchReturnSectionsType> = [
        "banks",
        "bills",
        "categories",
        "companies",
        "creditCards",
    ];
    public searchSections: HomeSearchReturnSectionsType = HOME_SEARCH_INITIALIZER;

    public page$: Subscription;
    public home$: Subscription;

    constructor() {
        super();
    }

    searchTermSubscriber(term: string) {
        this.home$ = this.homeService.getItems(term).subscribe({
            next: (items) => {
                this.searchSections = items;
            },
        });
    }

    ngOnInit() {
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

    onSearch(e: KeyboardEvent) {
        if (e.key !== "Enter") return;
        const searchTerm = this.search$.value;
        if (searchTerm.length > 1) {
            this.searchTermSubscriber(searchTerm);
        }
    }

    onClearSearch() {
        this.search$.next("");
        this.searchSections = HOME_SEARCH_INITIALIZER;
    }

    onSelect(item: any, event: MatOptionSelectionChange) {
        if (!event.isUserInput) return;
        this.homeService.getItem(item.id, item.type).subscribe({
            next: (resultItem) => {
                const option = {
                    data: resultItem,
                };
                this.dialog.open(ModalViewItem, option);
                this.onClearSearch();
            },
            error: () => this.generalService.errorSnackbar("error fetching item info"),
        });
    }

    getOptionName(option: any) {
        return option.name;
    }

    ngOnDestroy() {
        this.search$.unsubscribe();
        this.page$.unsubscribe();
    }
}
