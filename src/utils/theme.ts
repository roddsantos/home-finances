import { GeneralMeasureType } from "src/app/core/types/pages/profiles";

export function getPaddingIcon(measure: GeneralMeasureType) {
    switch (measure) {
        case "default":
            return "density_medium";
        case "large":
            return "density_large";
        case "minimum":
            return "density_small";
    }
}

export function getInputSizeIcon(measure: GeneralMeasureType) {
    switch (measure) {
        case "default":
            return "match_case";
        case "large":
            return "uppercase";
        case "minimum":
            return "lowercase";
    }
}

export function getBorderWidthIcon(measure: GeneralMeasureType) {
    switch (measure) {
        case "default":
            return "highlighter_size_3";
        case "large":
            return "highlighter_size_5";
        case "minimum":
            return "highlighter_size_1";
    }
}
