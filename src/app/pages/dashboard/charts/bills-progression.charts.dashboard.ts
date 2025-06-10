import { Context } from "chartjs-plugin-datalabels";
import { Chart } from "chart.js/auto";
import { DashboardBillsPerMonthType } from "src/app/core/types/subjects/dashboard.subjects";
import { MONTHS } from "src/utils/constants/general";
import { currentPallete, tint } from "src/utils/color";

const pallete = currentPallete();

const lineOptions: any = (datasets: any[]) => {
    const layout = { autoPadding: true, padding: { top: 0, right: 40, left: 40 } };
    const datalabels = {
        anchor: "end",
        align: "center",
        color: pallete.text1,
        font: { weight: "bold", family: "ReemKufi-SemiBold", size: 14 },
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
    const scales = {
        y: { display: false },
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
    theme: string
) =>
    new Chart("bills-per-month", {
        type: "line",
        data: {
            labels: data.map((bc) => MONTHS[bc.month].short),
            datasets: [
                {
                    label: "total value (R$)",
                    data: data.map((bm) => bm.total),
                    tension: 0.3,
                    backgroundColor:
                        theme === "binary" ? "transparent" : tint(0.3, pallete.secondary),
                    borderColor: pallete.secondary,
                    fill: true,
                },
            ],
        },
        options: lineOptions([data], theme),
    });
