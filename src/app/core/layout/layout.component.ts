import {
    Component,
    HostListener,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChild,
    inject,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { ModalProfile } from "src/app/components/modal/profile/profile.modal";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { ModalComponent } from "src/app/components/modal/modal.component";
import { MatIconModule } from "@angular/material/icon";
import { ServiceBill } from "src/app/services/bill.service";
import { BillState } from "src/app/core/subjects/subjects.bill";
import { CustomSnackbarComponent } from "src/app/components/custom-snackbar/custom-snackbar.component";
import { CommonModule } from "@angular/common";
import { RouteItemType, RoutesType } from "src/app/core/types/general";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { MatSidenavModule } from "@angular/material/sidenav";
import { ItemLayoutComponent } from "./item/item.layout.component";
import { ROUTES } from "src/utils/route";
import { HeaderLayoutComponent } from "./header/header.layout.component";
import { GeneralService } from "src/app/services/general.service";

@Component({
    standalone: true,
    selector: "app-layout",
    templateUrl: "./layout.component.html",
    styleUrls: ["./layout.component.css", "./item/item.layout.component.css"],
    imports: [
        MatIconModule,
        RouterModule,
        CommonModule,
        MatSidenavModule,
        ItemLayoutComponent,
        HeaderLayoutComponent,
    ],
})
export class LayoutComponent implements OnChanges {
    @ViewChild(ModalComponent) modal: any;
    @ViewChild(ModalProfile) profile: any;
    @Input() theme: string | null;

    constructor() {}

    public generalState = inject(GeneralState);
    private generalService = inject(GeneralService);

    public storage = inject(LocalStorageService);
    private snack = inject(CustomSnackbarComponent);

    public billApi = inject(ServiceBill);
    public billState = inject(BillState);

    public innerWidth: number;
    public themeUsed: string | null;

    onChangeRoute(route: RoutesType) {
        this.generalService.navigateTo(route);
    }

    items: RouteItemType[] = ROUTES;

    @HostListener("window:resize", [])
    onResize() {
        this.innerWidth = window.innerWidth;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["themeUsed"]) {
            this.themeUsed = changes["themeUsed"].currentValue;
        }
    }

    ngOnInit() {
        this.generalState.changePage(window.location.pathname);
        this.billApi.getBills().subscribe({
            next: (bills) => {
                if (bills.count === 0) this.billState.changeStatus("empty", "no bills");
                else this.billState.setBills(bills);
            },
            error: () => {
                this.snack.openSnackBar("error fetching bills", "error");
                this.billState.changeStatus("error", "error fetching bills");
            },
        });
    }

    onLogout() {
        this.storage.removeUser();
        this.modal.close();
        this.profile.update();
    }
}
