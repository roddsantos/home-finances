import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { RouteItemType } from "src/app/types/general";
import { ColorPipe } from "src/utils/pipes/colors";
import { ROUTES } from "src/utils/route";

@Component({
    standalone: true,
    selector: "header-layout",
    templateUrl: "./header.layout.component.html",
    styleUrls: ["./header.layout.component.css"],
    imports: [CommonModule, ColorPipe],
})
export class HeaderLayoutComponent {
    public actualPage = window.location.pathname;
    public page = ROUTES.find((r) => {
        console.log(this.actualPage);
        return r.page === this.actualPage;
    });
    public style = getComputedStyle(document.body);
    public primaryColor = this.style.getPropertyValue("--secondary");
}
