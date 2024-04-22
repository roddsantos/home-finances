import { DateType } from "src/app/types/general";
import { MONTHS } from "./constants/general";

export function getMonthAndYear(month: number, year: number, type: DateType) {
    switch (type) {
        case "mmYY":
            return `${month + 1 < 10 ? "0" + (month + 1) : month + 1}/${year
                .toString()
                .slice(-2)}`;
        case "mmmYY":
            return `${MONTHS[month].short}/${year.toString().slice(-2)}`;
        case "mmmmYYYY":
            return `${MONTHS[month].name}/${year}`;
    }
}
