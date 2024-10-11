import { CommonModule } from "@angular/common";
import { Component, HostListener, inject, Input } from "@angular/core";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { GeneralState } from "src/app/subjects/subjects.general";
import { ThemeType } from "src/app/types/general";
import { ColorPipe } from "src/utils/pipes/colors";

@Component({
    standalone: true,
    selector: "card-component",
    templateUrl: "./card.component.html",
    styleUrls: ["./card.component.css"],
    imports: [CommonModule, ColorPipe],
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
    @Input() noDivisor?: number;

    public actualTheme: ThemeType;
    public cardHeight: number;
    public cardWidth: number;

    public style: CSSStyleDeclaration;
    public background: string;
    public secondary: string;

    ngOnInit() {
        this.general.theme$.subscribe({
            next: (theme) => {
                this.actualTheme = theme as ThemeType;
            },
        });
        this.style = getComputedStyle(document.body);
        this.background = this.style.getPropertyValue("--background");
        this.secondary = this.style.getPropertyValue("--secondary");
    }

    ngAfterViewInit() {
        if (this.shadow) {
            this.cardHeight =
                document.getElementById("card-" + this.id)?.offsetHeight || 0;
            this.cardWidth = document.getElementById("card-" + this.id)?.offsetWidth || 0;
        }
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
