import { Dialog } from "@angular/cdk/dialog";
import { inject } from "@angular/core";
import { GeneralService } from "src/app/services/general.service";
import { GeneralState } from "../subjects/subjects.general";
import { LocalStorageService } from "src/app/services/local-storage.service";

export class GeneralPage {
    public generalState = inject(GeneralState);
    public generalService = inject(GeneralService);
    public localStorageService = inject(LocalStorageService);
    public dialog = inject(Dialog);

    constructor() {}
}
