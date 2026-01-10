import { CommonModule } from "@angular/common";
import { Component, inject, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { BankObjectType } from "src/app/core/types/data/bank.types";
import { SavingsType } from "src/app/core/types/objects";
import { ServiceSaving } from "src/app/services/saving.service";
import { MONTHS } from "src/utils/constants/general";

@Component({
    selector: "savings-template",
    template: `
        <div class="savings-container">
            <div class="saving-item" *ngFor="let saving of savingsList">
                <p>{{ months[saving.month].name }}</p>
                <h5>{{ saving.total | currency : "R$ " }}</h5>
            </div>
            <div (click)="fetchMoreSavings()" class="saving-item more" *ngIf="total > 4">
                <mat-icon
                    class="selection-icon"
                    aria-hidden="false"
                    aria-label="icon"
                    [fontIcon]="'add'"
                ></mat-icon>
            </div>
        </div>
    `,
    styleUrls: ["./bank.template.css"],
    standalone: true,
    imports: [CommonModule, MatIconModule],
})
export class SavingsBankTemplate {
    @Input() bank: BankObjectType;
    public savingsService = inject(ServiceSaving);
    public page = 1;
    public savingsList: SavingsType[] = [];
    public total: number = 0;
    public months = MONTHS;

    ngOnInit() {
        this.savingsService.getSavings(this.bank.id, this.page).subscribe({
            next: (result) => {
                this.savingsList = result.data;
                this.total = result.count;
            },
            error: () => {
                this.savingsList = [];
            },
        });
    }

    fetchMoreSavings() {
        this.page = this.page + 1;
        this.savingsService.getSavings(this.bank.id, this.page).subscribe({
            next: (result) => {
                this.savingsList = result.data;
                this.total = result.count;
            },
            error: () => {
                this.savingsList = [];
            },
        });
    }
}
