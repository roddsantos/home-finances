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

export function isValuesEqual(item1: any, item2: any) {
    if (typeof item1 === "object" && typeof item2 === "object")
        return isObjectsEqual(item1, item2);
    return item1 == item2;
}

export function isObjectsEqual(object1: any, object2: any) {
    if (object1 === null) {
        if (object2 === null) return true;
        return false;
    }

    if (object2 === null) {
        if (object1 === null) return true;
        return false;
    }

    const object1Keys = Object.keys(object1);
    const object2Keys = Object.keys(object2);

    if (object1Keys.length !== object2Keys.length) return false;

    let hadDiffKeyOrValue = false;

    for (let key of object1Keys) {
        if (
            !(object2Keys.find((key2) => key === key2) && object2[key] === object1[key])
        ) {
            hadDiffKeyOrValue = true;
            break;
        }
    }

    return !hadDiffKeyOrValue;
}
