import { NgFor } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { TypeBillsService } from "src/app/api/api.type-bills";
import { COMPANIES } from "src/utils/data";

@Component({
    selector: "management-type-bills",
    templateUrl: "./pages.management.type-bills.html",
    styleUrls: ["./pages.management.type-bills.css"],
    standalone: true,
    imports: [MatIcon, MatButton, NgFor],
})
export class TypeBillsManagementComponent {
    typeBills: Array<any>;

    ngOnInit() {
        let str = localStorage.getItem("typeBills");
        if (str) {
            let res = JSON.parse(str);
            this.typeBills = res.data;
        } else this.typeBills = [];
    }
}
