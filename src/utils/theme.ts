import { GeneralMeasureType } from "src/app/core/types/pages/profiles";

export function getPadding(measure: GeneralMeasureType) {
    switch (measure) {
        case "default":
            return "density_medium";
        case "large":
            return "density_large";
        case "minimum":
            return "density_small";
    }
}
