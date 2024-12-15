import { Dialog } from "@angular/cdk/dialog";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { Router } from "@angular/router";
import { CardComponent } from "src/app/components/card/card.component";
import { ModalViewItem } from "src/app/components/modal/view-item/view-item.modal";
import { HomeState } from "src/app/core/subjects/subjects.home";
import { UserState } from "src/app/core/subjects/subjects.user";
import { CardActionType } from "src/app/core/types/components";
import { Bill, BillData } from "src/app/core/types/objects";
import { ServiceBank } from "src/app/services/bank.service";
import { ServiceBill } from "src/app/services/bill.service";
import { ServiceCreditCard } from "src/app/services/credit-card.service";
import { BillsPipe } from "src/utils/pipes/bills";

@Component({
    selector: "page-dashboard",
    templateUrl: "./pages.dashboard.html",
    styleUrls: ["./pages.dashboard.css"],
    standalone: true,
    imports: [CommonModule, CardComponent, CurrencyPipe, BillsPipe, MatIconModule],
})
export class PageDashboard {
    public userState = inject(UserState);
    public homeState = inject(HomeState);
    public billService = inject(ServiceBill);
    public bankService = inject(ServiceBank);
    public creditCardService = inject(ServiceCreditCard);
    public dialog = inject(Dialog);

    public date = new Date();
    public router = new Router();

    ngOnInit() {
        this.billService.getHomeInfo().subscribe({
            next: (data) => {
                this.homeState.updateExpenses(data);
            },
        });
        this.bankService.getSavings().subscribe({
            next: (data) => {
                this.homeState.updateSavings(data);
            },
        });
        this.creditCardService.getTotalInvoices().subscribe({
            next: (data) => {
                this.homeState.updateInvoices(data);
            },
        });
        this.billService.getRecentBills().subscribe({
            next: (data) => {
                this.homeState.updateRecentBills(data.bills);
            },
        });
    }

    public actions: CardActionType[] = [
        {
            icon: "north_east",
            tooltip: "go to bills",
            action: () => this.router.navigate(["/bills"]),
        },
    ];

    public bankActions: CardActionType[] = [
        {
            icon: "north_east",
            tooltip: "go to banks",
            action: () => this.router.navigate(["/banks"]),
        },
    ];

    openBill(bill: Bill & BillData) {
        const option = {
            data: {
                item: { ...bill, sector: "bill" },
                header: "view item: " + bill.name,
                size: "md",
            },
        };
        this.dialog.open(ModalViewItem, option);
    }
}
