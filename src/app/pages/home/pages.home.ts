import { Dialog } from "@angular/cdk/dialog";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltip } from "@angular/material/tooltip";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { CardComponent } from "src/app/components/card/card.component";
import { ModalViewItem } from "src/app/components/modal/view-item/view-item.modal";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { HomeState } from "src/app/core/subjects/subjects.home";
import { UserState } from "src/app/core/subjects/subjects.user";
import { CardActionType } from "src/app/core/types/components";
import { Bill, BillData } from "src/app/core/types/objects";
import { DateSubjectType } from "src/app/core/types/subjects/general.subjects.type";
import { ServiceBank } from "src/app/services/bank.service";
import { ServiceBill } from "src/app/services/bill.service";
import { ServiceCreditCard } from "src/app/services/credit-card.service";
import { GeneralService } from "src/app/services/general.service";
import { HomeService } from "src/app/services/home.service";
import { MONTHS } from "src/utils/constants/general";
import { HOME_MONTHS } from "src/utils/constants/home";
import { BillsPipe } from "src/utils/pipes/bills";
import { ToggleButtonComponent } from "src/app/components/toggle-buttons/toggle-buttons.component";
import { FormControl } from "@angular/forms";
import {
    MonthYearToggleType,
    ToggleButtonItemsType,
} from "src/app/core/types/components/toggle-buttons";

@Component({
    selector: "page-home",
    templateUrl: "./pages.home.html",
    styleUrls: ["./pages.home.css"],
    standalone: true,
    imports: [
        CommonModule,
        CardComponent,
        CurrencyPipe,
        BillsPipe,
        MatIconModule,
        MatTooltip,
        ToggleButtonComponent,
    ],
})
export class PageHome {
    public userState = inject(UserState);
    public homeState = inject(HomeState);
    public generalState = inject(GeneralState);
    public billService = inject(ServiceBill);
    public bankService = inject(ServiceBank);
    public homeService = inject(HomeService);
    public creditCardService = inject(ServiceCreditCard);
    private generalService = inject(GeneralService);
    public dialog = inject(Dialog);

    public router = new Router();

    public todayBills: (Bill & BillData)[] = [];
    public theme = "default";

    public todaysDate = new Date();
    public dateSubscriber: Subscription;
    public months = MONTHS;
    public dateFilters = HOME_MONTHS;
    public dateCtrl = new FormControl<MonthYearToggleType | null>({
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
    });

    updateValues() {
        let date: DateSubjectType = {
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
        };
        this.dateSubscriber = this.homeState.date$.subscribe({
            next: (dateState) => {
                this.dateCtrl.patchValue(dateState);
                date = dateState;
            },
        });
        this.homeService.getBillsInfo(date).subscribe({
            next: (data) => {
                this.homeState.updateExpenses(data);
            },
        });
        this.homeService.getSavingsInfo(date).subscribe({
            next: (data) => {
                this.homeState.updateSavings(data);
            },
        });
        this.homeService.getCreditCardsInfo(date).subscribe({
            next: (data) => {
                this.homeState.updateInvoices(data);
            },
        });
        this.homeService.getRecentBills(date).subscribe({
            next: (data) => {
                this.todayBills = data.bills.filter(
                    (bill) => new Date(bill.due).getDate() === new Date().getDate()
                );
                this.homeState.updateRecentBills(data.bills);
            },
        });
    }

    ngOnInit() {
        this.updateValues();
        this.generalState.theme$.subscribe({
            next: (theme) => (this.theme = theme),
        });
    }

    public actions: CardActionType[] = [
        {
            icon: "north_east",
            tooltip: "go to bills",
            action: () => this.generalService.navigateTo("/bills"),
        },
    ];

    public bankActions: CardActionType[] = [
        {
            icon: "north_east",
            tooltip: "go to banks",
            action: () => this.generalService.navigateTo("/banks"),
        },
    ];

    public creditCardActions: CardActionType[] = [
        {
            icon: "north_east",
            tooltip: "go to credit cards",
            action: () => this.generalService.navigateTo("/credit-cards"),
        },
    ];

    onChangeFilter(event: ToggleButtonItemsType<DateSubjectType>) {
        if (!event.value) return;

        this.dateCtrl.patchValue({ ...event.value });
        this.homeState.updateDate(event.value);
        this.updateValues();
    }

    openBill(bill: Bill & BillData) {
        const option = {
            data: bill,
        };
        this.dialog.open(ModalViewItem, option);
    }

    ngOnDestroy() {
        this.dateSubscriber.unsubscribe();
    }
}
