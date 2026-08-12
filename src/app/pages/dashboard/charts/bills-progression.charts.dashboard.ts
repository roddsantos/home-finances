import { Context } from "chartjs-plugin-datalabels";
import { Chart } from "chart.js/auto";
import { DashboardBillsPerMonthType } from "src/app/core/types/data/dashboard.types";
import { MONTHS } from "src/utils/constants/general";
import { currentPallete, getThemeVars, tint } from "src/utils/color";

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

const lineOptions: any = (datasets: any[]) => {
    const layout = { autoPadding: true, padding: { top: 0, right: 40, left: 40 } };
    const datalabels = {
        anchor: "end",
        align: "top",
        color: pallete.text1,
        font: { weight: "bold", family: pallete.font2, size: 14 },
        formatter: (v: number, context: Context) => {
            return (
                v +
                " R$\n" +
                datasets[context.datasetIndex][context.dataIndex].delta +
                "%"
            );
        },
    };
    const tooltip = {
        callbacks: {
            footer: (context: any) => {
                return (
                    "qty: " +
                    datasets[context[0].datasetIndex][context[0].dataIndex].count +
                    " bill(s)"
                );
            },
        },
    };
    const maxValue = Math.max(...datasets.flatMap((arr) => arr.map((v: any) => v.total)));
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
            tooltip,
        },
        scales,
    };
};

export const billsProgressionChart = (
    data: DashboardBillsPerMonthType[],
    theme: string,
) =>
    new Chart("bills-per-month", {
        type: "line",
        data: {
            labels: data.map((bc) => MONTHS[bc.month].short),
            datasets: [
                {
                    label: "total value (R$)",
                    data: data.map((bm) => bm.total),
                    tension: borderRadiusToTension(),
                    backgroundColor:
                        theme === "binary" ? "transparent" : tint(0.5, pallete.secondary),
                    borderColor: pallete.borderColor,
                    fill: true,
                },
            ],
        },
        options: lineOptions([data], theme),
    });
