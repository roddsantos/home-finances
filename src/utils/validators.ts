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

/**
 * Transform all characters to lower case, remove accented characters
 * and replace with normal characters. Great to compare two strings and
 * search in a known array
 * @param {String} str - String to be processed
 * @returns the string processed
 * @example removeDiacritics("Claude Makélélé") returns "claude makelele"
 */
export const removeDiacritics = (str: string) => {
    if (!str) return "";
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
};
