import { CategoriesSummaryType } from "src/app/core/types/services/dashboard.services.types";
import { currentPallete, getThemeVars } from "src/utils/color";
import { Chart } from "chart.js/auto";
import ChartDataLabels, { Context } from "chartjs-plugin-datalabels";

const pallete = currentPallete();
const themeProfile = getThemeVars(true);

const categoryIconsPlugin = (summary: CategoriesSummaryType) => ({
    id: "categoryIcons",

    afterDatasetsDraw(chart: Chart) {
        const { ctx } = chart;
        const meta = chart.getDatasetMeta(0);
        const iconSize = 42;
        const padding = 8;
        const minBarHeight = iconSize + padding * 2;

        ctx.save();

        meta.data.forEach((bar: any, index: number) => {
            const icon = summary.topCategories[index].category?.icon;

            if (!icon) return;

            const barHeight = Math.abs(bar.base - bar.y);
            const isSmallBar = barHeight < minBarHeight;

            ctx.font = `${iconSize}px 'Material Symbols Rounded'`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = isSmallBar ? pallete.text1 : pallete.bh;

            if (isSmallBar) {
                ctx.fillText(icon, bar.x, bar.y - iconSize);
            } else {
                const centerY = (bar.y + bar.base) / 2;
                ctx.fillText(icon, bar.x, centerY);
            }
        });

        ctx.restore();
    },
});

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
        font: { weight: "bold", family: pallete.font1, size: 14 },
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
    const iconPlugin = categoryIconsPlugin(summary);
    return new Chart("categories-chart", {
        plugins: [ChartDataLabels, iconPlugin],
        type: "bar",
        data: {
            labels: summary.topCategories.map((tc) => tc.category!.name),
            datasets: [
                {
                    label: "",
                    data: summary.topCategories.map((tc) => tc.total),
                    spacing: 1,
                    borderWidth: themeProfile.borderWidth as number,
                    borderRadius: themeProfile.borderRadius as number,
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
