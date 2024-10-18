import { DateType } from "src/app/core/types/general";
import { MONTHS } from "./constants/general";

type Entry1 = { month?: number; year?: number; date?: Date };

export function getMonthAndYear(param: Entry1, type: DateType) {
    const date = param.date ? new Date(param.date) : null;
    const month = param.month ? param.month : null;
    const year = param.year ? param.year : null;

    switch (type) {
        case "mmYY":
            return param.date
                ? `${date!.getMonth() + 1 < 10 ? "0" : ""}${date!.getDate()}/${date!
                      .getFullYear()
                      .toString()
                      .slice(-2)}`
                : `${month! + 1 < 10 ? "0" + (month! + 1) : month! + 1}/${year!
                      .toString()
                      .slice(-2)}`;
        case "mmmYY":
            return param.date
                ? `${MONTHS[date!.getMonth()].short}/${date!
                      .getFullYear()
                      .toString()
                      .slice(-2)}`
                : `${MONTHS[month!].short}/${year!.toString().slice(-2)}`;
        case "mmmmYYYY":
            return param.date
                ? `${MONTHS[date!.getMonth()].name}/${date?.getFullYear()}`
                : `${MONTHS[month!].name}/${year}`;
        case "ddMMyyyy":
            return param.date
                ? `${date?.toLocaleDateString("pt-BR")}`
                : `${MONTHS[month!].name}/${year}`;
    }
}
