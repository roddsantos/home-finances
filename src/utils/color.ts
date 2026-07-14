type ColorObject = Record<"r" | "g" | "b" | "a", number>;
const singleColorSpace = 16 * 16; // 256
const blueSpace = singleColorSpace;
const greenSpace = blueSpace * singleColorSpace; // 65536
const redSpace = greenSpace * singleColorSpace; // 16777216

export const tint = (
    ratio: number,
    inputColor: string,
    {
        toColor,
        useLinear,
        reformat,
    }: { toColor?: string; useLinear?: boolean; reformat?: boolean } = {},
) => {
    const { round } = Math;

    const clampedRatio = Math.min(Math.max(ratio, -1), 1);

    if (ratio < -1 || ratio > 1) {
        console.info(
            `Ratio should be between -1 and 1 and it is ${ratio}. It will be clamped to ${clampedRatio}`,
        );
    }

    let baseColor = inputColor;

    if (inputColor[0] !== "r" && inputColor[0] !== "#") {
        baseColor = "#000";

        console.info(
            `Invalid input color format. "${inputColor}" should be rgb(a) or hex. It will fallback to "${baseColor}"`,
        );
    }

    let isRGBformat = baseColor.length > 9 || baseColor.includes("rgb(");

    isRGBformat = reformat ? !isRGBformat : isRGBformat;

    if (toColor) {
        const isToColorRgbFormat = toColor.length > 9 || toColor.includes("rgb(");

        isRGBformat = reformat ? !isToColorRgbFormat : isToColorRgbFormat;
    }

    const black: ColorObject = { r: 0, g: 0, b: 0, a: -1 };
    const white: ColorObject = { r: 255, g: 255, b: 255, a: -1 };

    const formattedBaseColor = hexToRgb(baseColor);

    const formattedToColor =
        toColor && !reformat ? hexToRgb(toColor) : clampedRatio < 0 ? black : white;

    const toColorRatio = Math.abs(clampedRatio);
    const baseRatio = 1 - toColorRatio;

    const outputColor = {} as ColorObject;

    if (useLinear) {
        outputColor.r = round(
            formattedBaseColor.r * baseRatio + formattedToColor.r * toColorRatio,
        );

        outputColor.g = round(
            formattedBaseColor.g * baseRatio + formattedToColor.g * toColorRatio,
        );

        outputColor.b = round(
            formattedBaseColor.b * baseRatio + formattedToColor.b * toColorRatio,
        );
    } else {
        outputColor.r = round(
            Math.sqrt(
                formattedBaseColor.r ** 2 * baseRatio +
                    formattedToColor.r ** 2 * toColorRatio,
            ),
        );

        outputColor.g = round(
            Math.sqrt(
                formattedBaseColor.g ** 2 * baseRatio +
                    formattedToColor.g ** 2 * toColorRatio,
            ),
        );

        outputColor.b = round(
            Math.sqrt(
                formattedBaseColor.b ** 2 * baseRatio +
                    formattedToColor.b ** 2 * toColorRatio,
            ),
        );
    }

    const blendedAlpha =
        formattedBaseColor.a * baseRatio + formattedToColor.a * toColorRatio;

    outputColor.a = formattedToColor.a < 0 ? formattedBaseColor.a : blendedAlpha;

    const hasAlpha = formattedBaseColor.a >= 0 || formattedToColor.a >= 0;

    if (isRGBformat) {
        return `rgb${hasAlpha ? "a" : ""}(${outputColor.r},${outputColor.g},${outputColor.b}${
            hasAlpha ? `,${round(outputColor.a * 1000) / 1000}` : ""
        })`;
    }

    return `#${(
        outputColor.r * redSpace +
        outputColor.g * greenSpace +
        outputColor.b * blueSpace +
        (hasAlpha ? round(outputColor.a * 255) : 0)
    )
        .toString(16)
        .padStart(hasAlpha ? 8 : 6, "0")
        .slice(0, hasAlpha ? undefined : 6)}`;
};

function hexToRgb(hex: string): ColorObject {
    let normalized = hex.replace("#", "");

    if (normalized.length === 3) {
        normalized = normalized
            .split("")
            .map((c) => c + c)
            .join("");
    }

    if (normalized.length === 4) {
        normalized = normalized
            .split("")
            .map((c) => c + c)
            .join("");
    }

    // RRGGBB
    if (normalized.length === 6) {
        return {
            r: parseInt(normalized.slice(0, 2), 16),
            g: parseInt(normalized.slice(2, 4), 16),
            b: parseInt(normalized.slice(4, 6), 16),
            a: -1,
        };
    }

    // RRGGBBAA
    return {
        r: parseInt(normalized.slice(0, 2), 16),
        g: parseInt(normalized.slice(2, 4), 16),
        b: parseInt(normalized.slice(4, 6), 16),
        a: parseInt(normalized.slice(6, 8), 16) / 255,
    };
}

function relativeLuminance({ r, g, b }: { r: number; g: number; b: number }): number {
    const srgb = [r, g, b].map((value) => {
        const v = value / 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function contrastRatio(l1: number, l2: number): number {
    const brightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);

    return (brightest + 0.05) / (darkest + 0.05);
}

export function bestContrastColor(
    baseColor: string,
    optionA: string,
    optionB: string,
): string {
    const baseLum = relativeLuminance(hexToRgb(baseColor));
    const lumA = relativeLuminance(hexToRgb(optionA));
    const lumB = relativeLuminance(hexToRgb(optionB));

    const contrastA = contrastRatio(baseLum, lumA);
    const contrastB = contrastRatio(baseLum, lumB);

    return contrastA >= contrastB ? optionA : optionB;
}

/**
 * Function to get a contrast color between 2 available colors
 * based on the param color
 * @param {string} color The color to be verified
 * @returns {string} The contrast color
 */
export function contrastText(color: string) {
    const { text1, text2 } = currentPallete();

    const choosedColor = bestContrastColor(color, text1, text2);

    return choosedColor === text1
        ? "var(--text-1) !important"
        : "var(--text-2) !important";
}

export function getThemeVars(asNumbers: boolean = false) {
    const style = getComputedStyle(document.body);

    const borderRadius = style.getPropertyValue("--border-radius");
    const borderWidth = style.getPropertyValue("--border-width");

    return {
        borderRadius: asNumbers ? parseInt(borderRadius) : borderRadius,
        borderWidth: asNumbers ? parseInt(borderWidth) : borderWidth,
    };
}

export function currentPallete() {
    const style = getComputedStyle(document.body);

    const primary = style.getPropertyValue("--primary");
    const secondary = style.getPropertyValue("--secondary");

    const background = style.getPropertyValue("--background");
    const bh = style.getPropertyValue("--bh");
    const borderColor = style.getPropertyValue("--border-color");
    const info = style.getPropertyValue("--info");
    const warning = style.getPropertyValue("--warning");
    const error = style.getPropertyValue("--error");
    const success = style.getPropertyValue("--success");

    const text1 = style.getPropertyValue("--text-1");
    const text2 = style.getPropertyValue("--text-2");
    const text3 = style.getPropertyValue("--text-2");

    const font1 = style.getPropertyValue("--font-1");
    const font2 = style.getPropertyValue("--font-2");

    return {
        primary,
        secondary,
        background,
        borderColor,
        bh,
        info,
        warning,
        error,
        success,
        text1,
        text2,
        text3,
        font1,
        font2,
    };
}

export function getBackgroundColor(id: string) {
    const { background } = currentPallete();

    const element = document.getElementById(id);
    if (!element) return background;

    const elementStyle = window.getComputedStyle(element);
    const backgroundElementStyle = elementStyle.getPropertyValue("background-color");

    if (
        backgroundElementStyle !== "transparent" &&
        backgroundElementStyle !== "rgba(0, 0, 0, 0)"
    ) {
        return rgbToHex(backgroundElementStyle) || backgroundElementStyle;
    }

    let parentElement = element.parentElement;
    if (!parentElement) return background;

    while (parentElement && parentElement !== document.documentElement) {
        const computedStyle = window.getComputedStyle(parentElement);
        const backgroundColor = computedStyle.getPropertyValue("background-color");

        if (
            backgroundColor &&
            backgroundColor !== "transparent" &&
            backgroundElementStyle !== "rgba(0, 0, 0, 0)"
        ) {
            return rgbToHex(backgroundColor) || backgroundColor;
        }

        parentElement = parentElement.parentElement;
    }
    return background;
}

export function rgbToHex(rgbString: string) {
    const match = rgbString.match(/\d+/g);

    if (!match || match.length < 3) {
        return null;
    }

    const hex = match
        .map((component) => {
            const num = +component;
            const hexVal = num.toString(16);
            return hexVal.padStart(2, "0");
        })
        .join("");

    return `#${hex}`;
}
