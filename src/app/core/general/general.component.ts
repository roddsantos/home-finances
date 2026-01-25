import { Component, inject } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { GeneralService } from "src/app/services/general.service";
import { LocalStorageService } from "src/app/services/local-storage.service";

@Component({
    selector: "",
    template: "",
})
export class GeneralComponent {
    public generalService = inject(GeneralService);
    public generalState = inject(GeneralState);
    public localStorageService = inject(LocalStorageService);

    getFormDirtyValues(form: FormGroup) {
        let dirtyValues: Record<string, any> = {};

        Object.keys(form.controls).forEach((key) => {
            let currentControl = form.controls[key];

            if (currentControl.dirty) {
                if (currentControl instanceof FormGroup) {
                    const childDirtyValues = this.getFormDirtyValues(currentControl);

                    if (Object.keys(childDirtyValues).length > 0) {
                        dirtyValues[key] = childDirtyValues;
                    }
                } else if (currentControl instanceof FormControl) {
                    dirtyValues[key] = currentControl.value;
                }
            }
        });

        return dirtyValues;
    }
}
