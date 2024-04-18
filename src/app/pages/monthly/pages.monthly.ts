import { Component } from "@angular/core";
import { CustomListComponent } from "src/app/components/custom-list/custom-list.component";

@Component({
    selector: "page-monthly",
    templateUrl: "./pages.monthly.html",
    styleUrls: ["./pages.monthly.css"],
    standalone: true,
    imports: [CustomListComponent],
})
export class PageMonthly {}
