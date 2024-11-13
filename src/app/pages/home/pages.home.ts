import { CommonModule, CurrencyPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { Router } from "@angular/router";
import { CardComponent } from "src/app/components/card/card.component";
import { HomeState } from "src/app/core/subjects/subjects.home";
import { UserState } from "src/app/core/subjects/subjects.user";
import { CardActionType } from "src/app/core/types/components";
import { SumAndCountData } from "src/app/core/types/services";
import { ServiceBank } from "src/app/services/bank.service";
import { ServiceBill } from "src/app/services/bill.service";
import { ServiceCreditCard } from "src/app/services/credit-card.service";

@Component({
    selector: "page-home",
    templateUrl: "./pages.home.html",
    styleUrls: ["./pages.home.css"],
    standalone: true,
    imports: [CommonModule, CardComponent, CurrencyPipe, MatIconModule],
})
export class PageHome {
    public userState = inject(UserState);
    public homeState = inject(HomeState);
    public billService = inject(ServiceBill);
    public bankService = inject(ServiceBank);
    public creditCardService = inject(ServiceCreditCard);

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
}
