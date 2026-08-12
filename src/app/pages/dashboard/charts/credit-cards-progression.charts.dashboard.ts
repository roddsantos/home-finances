import { PiggyBanksProgressionType } from "src/app/core/types/data/dashboard.types";
import { currentPallete, getThemeVars, tint } from "src/utils/color";
import { Chart } from "chart.js/auto";
import { MONTHS } from "src/utils/constants/general";
import { Context } from "chartjs-plugin-datalabels";
import { CreditCardDashboardType } from "src/app/core/types/services";

const pallete = currentPallete();
const themeProfile = getThemeVars(true);

const borderRadiusToTension = () => {
    const borderRadius = themeProfile.borderRadius as number;
    if (borderRadius === 0) return 0;
    if (borderRadius < 5) return 0.1;
    if (borderRadius < 10) return 0.2;
    if (borderRadius < 15) return 0.3;
    return 0.4;
};

const lineOptions: any = (data: any[]) => {
    const layout = { autoPadding: true, padding: { top: 0, right: 40, left: 40 } };
    const datalabels = {
        anchor: "end",
        align: "top",
        color: pallete.text1,
        font: { weight: "bold", family: pallete.font2, size: 14 },
        formatter: (v: number, context: Context) => {
            return (
                v + " R$\n" + data[context.datasetIndex][context.dataIndex].delta + "%"
            );
        },
    };

    const maxValue = Math.max(...data.flatMap((arr) => arr.map((v: any) => v.invoice)));
    const scales = {
        y: {
            display: false,
            min: 0,
            max: maxValue + maxValue * 0.25,
        },
        x: { ticks: { font: { weight: "bold", size: 12 } } },
    };

    return {
        layout,
        clip: false,
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            datalabels,
        },
        scales,
    };
};

export function creditCardProgressionChart(
    ccData: CreditCardDashboardType[],
    theme: string,
) {
    return new Chart("credit-cards-chart", {
        type: "line",
        data: {
            labels: ccData[0].data.map((cc, i) => MONTHS[cc.month].short),
            datasets: ccData.map((cc, i) => ({
                label: cc.title,
                data: cc.data.map((cc) => cc.invoice),
                tension: borderRadiusToTension(),
                backgroundColor: theme === "binary" ? "transparent" : tint(0.5, cc.color),
                borderColor: cc.color,
                fill: true,
            })),
        },
        options: lineOptions(ccData.map((cc, i) => cc.data)),
    });
}
