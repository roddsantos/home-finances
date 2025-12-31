import { DashboardSavingsType } from "src/app/core/types/subjects/dashboard.subjects";
import { currentPallete, getThemeVars } from "src/utils/color";
import { Chart } from "chart.js/auto";

const pallete = currentPallete();
const themeProfile = getThemeVars(true);
const ARC = 120;

const doughnutOptions: any = {
    circumference: 360 - ARC,
    rotation: -1 * ARC,
    cutout: 50,
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

export function savingsChart(savings: DashboardSavingsType, theme: string) {
    return new Chart("money-chart", {
        type: "doughnut",
        data: {
            datasets: [
                {
                    weight: 1.5,
                    data: [
                        savings.totalSettled,
                        savings.totalPending,
                        savings.totalPreview,
                    ],
                    backgroundColor:
                        theme === "binary"
                            ? "transparent"
                            : [pallete.warning, pallete.error, pallete.info],
                    borderColor:
                        theme === "binary"
                            ? [pallete.warning, pallete.error, pallete.info]
                            : "transparency",
                    borderRadius: themeProfile.borderRadius as number,
                },
            ],
        },
        options: doughnutOptions,
    });
}
