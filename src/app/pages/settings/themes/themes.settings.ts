import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { CardComponent } from "src/app/components/card/card.component";
import { Dialog } from "@angular/cdk/dialog";
import { ModalNewTheme } from "src/app/components/modal/new-theme/new-theme.modal";
import { ThemeObjectType } from "src/app/core/types/pages/theme";
import { ThemeService } from "src/app/services/theme.service";
import { CustonButton } from "src/app/components/button/custom-button.component";
import { ThemeState } from "src/app/core/subjects/subjects.theme";
import { MatTooltip } from "@angular/material/tooltip";
import { ActionsComponent } from "src/app/components/actions/actions.component";
import { ActionItem } from "src/app/core/types/components";
import { ModalDialogConfirmation } from "src/app/components/modal/dialog-confirmation/dialog-confirmation.modal";
import { GeneralComponent } from "src/app/core/general/general.component";
import { Observable, Subscription } from "rxjs";

@Component({
    selector: "themes-settings",
    templateUrl: "./themes.settings.html",
    styleUrls: ["./themes.settings.css"],
    standalone: true,
    imports: [
        ActionsComponent,
        CardComponent,
        CommonModule,
        CustonButton,
        MatIconModule,
        MatTooltip,
    ],
})
export class ThemeSettingsComponent extends GeneralComponent implements OnInit {
    public dialog = inject(Dialog);
    public selectedTheme: string;

    private themeService = inject(ThemeService);
    public themeState = inject(ThemeState);
    private theme$: Subscription;
    private deleteTheme$: Subscription;

    actions: ActionItem[] = [
        {
            name: "",
            icon: "edit",
            action: (data: ThemeObjectType) => this.onEdit(data),
            color: "var(--info)",
        },
        {
            name: "",
            icon: "delete",
            action: (data: ThemeObjectType) => this.onDeleteModal(data),
            color: "var(--error)",
        },
    ];

    ngOnInit() {
        this.theme$ = this.generalState.theme$.subscribe({
            next: (theme) => {
                this.selectedTheme = theme;
            },
        });
    }

    clickedTheme(theme: ThemeObjectType, event: any) {
        if (event.target.className !== "mat-mdc-button-touch-target") {
            this.selectedTheme = theme.id;
            this.themeService.setTheme(theme);
        }
    }

    onNewProfileTheme() {
        this.dialog.open(ModalNewTheme, {
            data: {},
        });
    }

    onEdit(theme: ThemeObjectType) {
        this.dialog.open(ModalNewTheme, {
            data: { theme, selected: this.selectedTheme === theme.id },
        });
    }

    onDeleteModal(data: ThemeObjectType) {
        this.dialog.open(ModalDialogConfirmation, {
            data: {
                header: data.title,
                title: "delete theme?",
                description: "this action is irreversable",
                action: () => this.onDelete(data),
                button: "delete",
            },
        });
    }

    onDelete(data: ThemeObjectType) {
        this.deleteTheme$ = this.themeService.deleteTheme(data.id).subscribe({
            next: (id) => {
                this.themeState.removeTheme(id);
                this.generalService.successSnackbar("theme deleted successfully");
            },
            error: () => {
                this.generalService.errorSnackbar("error deleting theme");
            },
        });
    }

    onDestroy() {
        this.theme$.unsubscribe();
        this.deleteTheme$.unsubscribe();
    }
}
