import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { CustomTabType } from "src/app/core/types/components/tabs";

@Component({
    selector: "custom-tabs",
    standalone: true,
    templateUrl: "./tabs.component.html",
    styleUrls: ["./tabs.component.css"],
    imports: [CommonModule, MatIconModule],
})
export class CustomTabs {
    @Input() tab: number = 0;
    @Input() tabs: CustomTabType[] = [];
    @Output() getTab = new EventEmitter<CustomTabType>();

    public currentTab = 0;

    handleChangeTab(tab: CustomTabType) {
        this.currentTab = tab.index;
        this.getTab.emit(tab);
    }
}
