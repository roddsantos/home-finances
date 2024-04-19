import { AvailableDataFilters } from "./../../../types/components";
import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { ModalState } from "src/app/subjects/subjects.modal";
import { ModalComponent } from "src/app/components/modal/modal.component";
import { MatChipsModule } from "@angular/material/chips";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { AvailableFilters, FilterDisplay } from "src/app/types/components";
import { TypeBillState } from "src/app/subjects/subjects.type-bills";
import { CommonModule } from "@angular/common";
import { MatSelect, MatSelectChange, MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButton } from "@angular/material/button";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Observable } from "rxjs";
import { TypeBill } from "src/app/types/objects";
import { CustomListState } from "../custom-list.subjects.component";

@Component({
    selector: "dialog-custom-list",
    templateUrl: "./custom-list.dialog.component.html",
    styleUrls: ["./custom-list.dialog.component.css"],
    standalone: true,
    imports: [
        CommonModule,
        MatButton,
        ModalComponent,
        MatSelectModule,
        MatAutocompleteModule,
        MatChipsModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
    ],
})
export class DialogCustomList implements OnInit {
    public modalState = inject(ModalState);
    public tbState = inject(TypeBillState);
    public clState = inject(CustomListState);
    @ViewChild(ModalComponent) modalComponent: any;
    @ViewChild("typeBillSelector") typeBillSelector: MatSelect;

    separatorKeysCodes: number[] = [ENTER, COMMA];
    tbCtrl = new FormControl("");
    tbFiltered: Observable<TypeBill[]>;
    selectedFilters: FilterDisplay[] = [];

    ngOnInit() {
        this.modalState.onSubmitFooter("OK", "cancel");
        this.modalState.disableButton();
        this.modalState.changeHeader("new credit card");
    }

    isData(item: AvailableFilters): item is AvailableDataFilters {
        return (item as AvailableDataFilters) !== undefined;
    }

    addFilter(event: MatSelectChange, identifier: AvailableFilters) {
        const filter = event.value;
        const hasFilter = this.selectedFilters.find((f) => f.id === filter.id);
        if (this.isData(identifier)) {
            this.clState.datafilters$.subscribe({
                next: (data) => {
                    const hasFilterDefined = data.find((f) => f.id === filter.id);
                    if (!hasFilter && !hasFilterDefined)
                        this.selectedFilters.push({
                            id: filter.id,
                            identifier,
                            name: filter.name,
                        });
                },
            });
        } else
            this.selectedFilters.push({
                id: identifier === "month" ? filter.order : filter,
                identifier,
                name: identifier === "month" ? filter.name : filter,
            });
        this.tbCtrl.patchValue("");
        this.typeBillSelector.value = "";
    }

    removeFilter(index: number) {
        this.selectedFilters.splice(index, 1);
    }

    onSubmit() {
        console.log("CHIPS", this.selectedFilters);
    }
}
