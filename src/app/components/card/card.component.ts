import { CommonModule } from "@angular/common";
import { Component, HostListener, inject, Input } from "@angular/core";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { ThemeType } from "src/app/core/types/general";
import { ColorPipe } from "src/utils/pipes/colors";
import { CardActionType } from "src/app/core/types/components";
import { MatTooltip } from "@angular/material/tooltip";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@Component({
    standalone: true,
    selector: "card-component",
    templateUrl: "./card.component.html",
    styleUrls: ["./card.component.css"],
    imports: [CommonModule, MatTooltip, MatIconModule, MatButtonModule, ColorPipe],
})
export class CardComponent {
    public storage = inject(LocalStorageService);
    public general = inject(GeneralState);

    @Input() id: string;
    @Input() title?: string;
    @Input() description?: string;
    @Input() shadow?: boolean;
    @Input() border?: boolean;
    @Input() backgroundColor?: string;
    @Input() noDivisor?: boolean;
    @Input() actions?: CardActionType[];

    public actualTheme: ThemeType;
    public cardHeight: number;
    public cardWidth: number;

    public style: CSSStyleDeclaration;
    public background: string;
    public backgroundHighlighter: string;
    public secondary: string;

    ngOnInit() {
        this.general.theme$.subscribe({
            next: (theme) => {
                this.actualTheme = theme as ThemeType;
            },
        });
        this.style = getComputedStyle(document.body);
        this.background = this.style.getPropertyValue("--background");
        this.backgroundHighlighter = this.style.getPropertyValue("--bh");
        this.secondary = this.style.getPropertyValue("--secondary");
    }

    ngAfterViewInit() {
        if (this.shadow) {
            this.cardHeight =
                document.getElementById("card-" + this.id)?.offsetHeight || 0;
            this.cardWidth = document.getElementById("card-" + this.id)?.offsetWidth || 0;
        }
    }

    isString(icon: string | string[]): icon is string {
        return typeof icon === "string";
    }

    @HostListener("window:resize", ["$event"])
    onResize() {
        if (this.shadow) {
            this.cardHeight =
                document.getElementById("card-" + this.id)?.offsetHeight || 0;
            this.cardWidth = document.getElementById("card-" + this.id)?.offsetWidth || 0;
        }
    }
}
