import { Component, ViewEncapsulation, inject } from "@angular/core";
import { LocalStorageService } from "./services/local-storage.service";
import { UserState } from "src/app/subjects/subjects.user";
import { TypeBillState } from "./subjects/subjects.type-bills";
import { TypeBill } from "./types/objects";
import { ServiceTypeBill } from "./services/type-bill.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
    encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
    public storage = inject(LocalStorageService);
    public userState = inject(UserState);
    public tbState = inject(TypeBillState);
    public tbService = inject(ServiceTypeBill);

    title = "bills-app";

    ngOnInit() {
        const user = this.storage.getUser();
        if (user) this.userState.setUser(user);

        const tbs = this.storage.getTypeBills();
        if (tbs) this.tbState.setTypeBill(tbs);
        else {
            console.log("TBS", tbs);
            this.tbService.getTypeBills().subscribe({
                next: (tb) => {
                    this.tbState.setTypeBill(tb as TypeBill[]);
                    this.storage.setTypeBills(JSON.stringify(tb));
                },
                error: () => this.tbState.changeStatus("error"),
            });
        }
    }
}
