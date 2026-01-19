import { PiggyBanksProgressionType } from "src/app/core/types/data/dashboard.types";
import { currentPallete, getThemeVars, tint } from "src/utils/color";
import { Chart } from "chart.js/auto";
import { MONTHS } from "src/utils/constants/general";
import { Context } from "chartjs-plugin-datalabels";

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
        align: "center",
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

export function creditCardProgressionChart(
    piggyBanksProgression: PiggyBanksProgressionType[],
    theme: string,
) {
    return new Chart("credit-cards-chart", {
        type: "line",
        data: {
            labels: piggyBanksProgression[0].progression.map(
                (pb) => MONTHS[pb.month].short + "/" + pb.year,
            ),
            datasets: piggyBanksProgression.map((pb, i) => ({
                label: pb.bank,
                data: pb.progression.map((bm) => bm.savedValue),
                tension: borderRadiusToTension(),
                backgroundColor: theme === "binary" ? "transparent" : tint(0.3, pb.color),
                borderColor: pb.color,
                fill: true,
            })),
        },
        options: lineOptions(piggyBanksProgression.map((pbp) => pbp.progression)),
    });
}
