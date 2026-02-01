import { CommonModule } from "@angular/common";
import { Component, inject, ViewChild, ViewContainerRef } from "@angular/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule, MatIconButton } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { BehaviorSubject, debounceTime, distinctUntilChanged, Subscription } from "rxjs";
import { SectorPipe } from "src/utils/pipes/sector";
import { ROUTES } from "src/utils/route";
import { RouteItemActionType, RouteItemType } from "../../types/general";
import { PagePipe } from "src/utils/pipes/page";
import { Dialog } from "@angular/cdk/dialog";
import { ModalNewBank } from "src/app/components/modal/new-bank/new-bank.modal";
import { ModalNewBill } from "src/app/components/modal/new-bill/new-bill.modal";
import { ModalNewCreditCard } from "src/app/components/modal/new-credit-card/new-credit-card.modal";
import { ModalNewCompany } from "src/app/components/modal/new-company/new-company.modal";
import { ModalNewCategory } from "src/app/components/modal/new-category/new-category.modal";
import { ModalViewItem } from "src/app/components/modal/view-item/view-item.modal";
import { ModalNewSaving } from "src/app/components/modal/new-saving/new-saving.modal";
import { MatOptionSelectionChange } from "@angular/material/core";
import { SearchResultsArrayType } from "../../types/components/header";
import { BillsPipe } from "src/utils/pipes/bills";
import { HomeService } from "src/app/services/home.service";
import { GeneralComponent } from "../../general/general.component";

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
        BillsPipe,
    ],
    providers: [PagePipe],
})
export class HeaderLayoutComponent extends GeneralComponent {
    @ViewChild("action", { read: ViewContainerRef }) action: ViewContainerRef;
    public homeService = inject(HomeService);
    public dialog = inject(Dialog);
    public pagePipe = inject(PagePipe);

    public search$ = new BehaviorSubject<string>("");
    public screen: RouteItemType | undefined;
    public filteredOptions: SearchResultsArrayType[] = [];

    public page$: Subscription;
    public home$: Subscription;

    constructor() {
        super();
        this.search$
            .pipe(debounceTime(300), distinctUntilChanged())
            .subscribe((value) => {
                if (value.length > 1) {
                    this.filteredOptions = [];
                    this.searchTermSubscriber(value);
                }
            });
    }

    searchTermSubscriber(term: string) {
        this.home$ = this.homeService.getItem(term).subscribe({
            next: (items) => {
                console.log("items-------------------", items);
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

    onClearSearch() {
        this.search$.next("");
        this.filteredOptions = [];
    }

    onSelect(item: any, event: MatOptionSelectionChange) {
        if (!event.isUserInput) return;
        const option = {
            data: item,
        };
        this.dialog.open(ModalViewItem, option);
    }

    getOptionName(option: any) {
        return option.name;
    }

    openModal(selectedEvent: RouteItemActionType) {
        let options = {};
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
    }
}
