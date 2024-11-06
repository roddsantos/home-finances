import { CommonModule, CurrencyPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { CardComponent } from "src/app/components/card/card.component";
import { UserState } from "src/app/core/subjects/subjects.user";
import { CardActionType } from "src/app/core/types/components";
import { FetchHomeData } from "src/app/core/types/services";
import { ServiceBill } from "src/app/services/bill.service";

@Component({
    selector: "page-home",
    templateUrl: "./pages.home.html",
    styleUrls: ["./pages.home.css"],
    standalone: true,
    imports: [CommonModule, CardComponent, CurrencyPipe],
})
export class PageHome {
    public userState = inject(UserState);
    public billService = inject(ServiceBill);
    public date = new Date();
    public router = new Router();
    public homeData: FetchHomeData = {
        monthSpent: 0,
        countSpent: 0,
    };

    ngOnInit() {
        this.billService.getHomeInfo().subscribe({
            next: (data) => {
                this.homeData = { ...data };
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
}
