import { Dialog } from "@angular/cdk/dialog";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltip } from "@angular/material/tooltip";
import { Router } from "@angular/router";
import { CardComponent } from "src/app/components/card/card.component";
import { ModalViewItem } from "src/app/components/modal/view-item/view-item.modal";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { HomeState } from "src/app/core/subjects/subjects.home";
import { UserState } from "src/app/core/subjects/subjects.user";
import { CardActionType } from "src/app/core/types/components";
import { Bill, BillData } from "src/app/core/types/objects";
import { ServiceBank } from "src/app/services/bank.service";
import { ServiceBill } from "src/app/services/bill.service";
import { ServiceCreditCard } from "src/app/services/credit-card.service";
import { GeneralService } from "src/app/services/general.service";
import { HomeService } from "src/app/services/home.service";
import { BillsPipe } from "src/utils/pipes/bills";

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

    public date = new Date();
    public router = new Router();

    public todayBills: (Bill & BillData)[] = [];
    public theme = "default";
    public style = getComputedStyle(document.body);
    public primaryColor = this.style.getPropertyValue("--primary");
    public secondaryColor = this.style.getPropertyValue("--secondary");
    public thirdColor = this.style.getPropertyValue("--third");
    public text1Color = this.style.getPropertyValue("--text-1");
    public text3Color = this.style.getPropertyValue("--text-3");

    ngOnInit() {
        this.homeService.getBillsInfo().subscribe({
            next: (data) => {
                this.homeState.updateExpenses(data);
            },
        });
        this.homeService.getSavingsInfo().subscribe({
            next: (data) => {
                this.homeState.updateSavings(data);
            },
        });
        this.homeService.getCreditCardsInfo().subscribe({
            next: (data) => {
                this.homeState.updateInvoices(data);
            },
        });
        this.homeService.getRecentBills().subscribe({
            next: (data) => {
                this.todayBills = data.bills.filter(
                    (bill) => new Date(bill.due).getDate() === new Date().getDate()
                );
                this.homeState.updateRecentBills(data.bills);
            },
        });
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

    openBill(bill: Bill & BillData) {
        const option = {
            data: bill,
        };
        this.dialog.open(ModalViewItem, option);
    }
}
