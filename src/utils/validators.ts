import {
    AbstractControl,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
} from "@angular/forms";

export function totalValueForBankType(
    mainForm: FormGroup,
    secondaryForm: FormGroup
): ValidatorFn {
    const isError =
        mainForm.value.typeBill.referTo === "banks" &&
        secondaryForm.value.bank1 &&
        secondaryForm.value.bank2;
    return (ctrl: AbstractControl): ValidationErrors | null => {
        if (!ctrl.value) return null;
        return ctrl.value < 0 && isError ? { totalBank: true } : null;
    };
}
