import ChartDataLabels, { Context } from "chartjs-plugin-datalabels";
import { Chart } from "chart.js/auto";
import { PaidBillsChartType } from "src/app/core/types/pages/dashboard";
import { currentPallete, getThemeVars } from "src/utils/color";

const pallete = currentPallete();
const themeProfile = getThemeVars(true);

const doughnutOptions: any = {
    cutout: 75,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: true },
        datalabels: {
            color: pallete.text1,
            backgroundColor: pallete.bh,
            font: { weight: "bold" },
            formatter: (v: any) => v + " R$",
        },
        tooltip: { enabled: false },
    },
};

export const paidBillsChart = (data: PaidBillsChartType) => {
    Chart.register(ChartDataLabels);

    return new Chart("paid-bills", {
        type: "doughnut",
        data: {
            datasets: [
                {
                    weight: 1,
                    data: [data.paid, data.pending],
                    backgroundColor: [pallete.warning, pallete.background],
                    borderColor: "transparency",
                    borderRadius: themeProfile.borderRadius as number,
                },
            ],
        },
        options: doughnutOptions,
    });
};
