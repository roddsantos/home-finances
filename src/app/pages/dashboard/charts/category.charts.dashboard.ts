import { CategoriesSummaryType } from "src/app/core/types/services/dashboard.services.types";
import { currentPallete } from "src/utils/color";
import { Chart } from "chart.js/auto";
import ChartDataLabels, { Context } from "chartjs-plugin-datalabels";

const pallete = currentPallete();

const barOptions: any = (summary: CategoriesSummaryType) => {
    const layout = { padding: { top: 10 } };
    const scales = {
        y: { display: false, max: summary.topCategories[0].total * 1.1 },
    };
    const tooltip = {
        callbacks: {
            footer: (context: any) => {
                return "qty: " + summary.topCategories[context[0].dataIndex].count;
            },
        },
    };
    const datalabels = {
        anchor: "end",
        align: "top",
        color: pallete.text1,
        font: { weight: "bold", family: pallete.font2, size: 14 },
        formatter: (v: any) => v + " R$",
    };

    return {
        clip: false,
        maintainAspectRatio: true,
        responsive: true,
        layout,
        scales,
        plugins: {
            tooltip,
            datalabels,
            legend: { display: false },
        },
    };
};

export const categoriesChart = (summary: CategoriesSummaryType, theme: string) => {
    Chart.register(ChartDataLabels);
    return new Chart("categories-chart", {
        plugins: [ChartDataLabels],
        type: "bar",
        data: {
            labels: summary.topCategories.map((tc) => tc.category!.name),
            datasets: [
                {
                    label: "",
                    data: summary.topCategories.map((tc) => tc.total),
                    spacing: 1,
                    borderWidth: 3,
                    borderRadius: 10,
                    borderColor:
                        theme === "binary"
                            ? summary.topCategories.map((tc) => tc.category!.color)
                            : "transparent",
                    backgroundColor:
                        theme === "binary"
                            ? "transparent"
                            : summary.topCategories.map((tc) => tc.category!.color),
                },
            ],
        },
        options: barOptions(summary),
    });
};
