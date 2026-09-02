import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart } from "chart.js/auto";
import { MoneyLeftChartType } from "src/app/core/types/pages/dashboard";
import { currentPallete, getThemeVars } from "src/utils/color";

const pallete = currentPallete();
const themeProfile = getThemeVars(true);

const doughnutOptions: any = {
    cutout: 75,
    clip: false,
    responsive: true,
    maintainAspectRatio: true,
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

export const moneyLeftChart = (data: MoneyLeftChartType) => {
    Chart.register(ChartDataLabels);

    return new Chart("money-left", {
        type: "doughnut",
        data: {
            datasets: [
                {
                    weight: 1,
                    data: [data.savings, data.spent],
                    backgroundColor: [pallete.success, pallete.background],
                    borderColor: "transparency",
                    borderRadius: themeProfile.borderRadius as number,
                },
            ],
        },
        options: doughnutOptions,
    });
};
