import { ToggleButtonItemsType } from "src/app/core/types/components/toggle-buttons";
import { DateSubjectType } from "src/app/core/types/subjects/general.subjects.type";
import { getMonthAndYearIntegers } from "../date";
import { MONTHS } from "./general";
import { HomeSearchReturnSectionsType } from "src/app/core/types/data/home.types";

export const HOME_MONTHS: ToggleButtonItemsType<DateSubjectType>[] = [
    {
        label: "last month",
        value: {
            ...getMonthAndYearIntegers(-1),
        },
    },
    {
        label: "this month",
        value: {
            ...getMonthAndYearIntegers(0),
        },
    },
    {
        label: `${MONTHS[getMonthAndYearIntegers(1).month].short}/${
            getMonthAndYearIntegers(1).year
        }`,
        value: {
            ...getMonthAndYearIntegers(1),
        },
    },
    {
        label: `${MONTHS[getMonthAndYearIntegers(2).month].short}/${
            getMonthAndYearIntegers(2).year
        }`,
        value: {
            ...getMonthAndYearIntegers(2),
        },
    },
];

export const HOME_SEARCH_INITIALIZER: HomeSearchReturnSectionsType = {
    banks: [],
    bills: [],
    categories: [],
    companies: [],
    creditCards: [],
};
