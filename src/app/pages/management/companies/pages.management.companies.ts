import { NgFor, NgStyle } from "@angular/common";
import { Component } from "@angular/core";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { COMPANIES } from "src/utils/data";

@Component({
    selector: "management-companies",
    templateUrl: "./pages.management.companies.html",
    styleUrls: ["./pages.management.companies.css"],
    standalone: true,
    imports: [MatIcon, MatButton, NgFor, NgStyle, MatIconButton],
})
export class ManagementCompaniesComponent {
    companies = COMPANIES;
}
