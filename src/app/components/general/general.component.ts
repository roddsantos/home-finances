import { Component, inject } from "@angular/core";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { GeneralService } from "src/app/services/general.service";

@Component({
    selector: "",
    template: "",
})
export class GeneralComponent {
    public generalService = inject(GeneralService);
    public generalState = inject(GeneralState);
}
