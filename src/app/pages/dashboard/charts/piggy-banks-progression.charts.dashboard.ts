import { currentPallete, getThemeVars, tint } from "src/utils/color";
import { Chart } from "chart.js/auto";
import { Context } from "chartjs-plugin-datalabels";
import {
    MonthPiggyBankCountsType,
    PiggyBanksProgressionType,
} from "src/app/core/types/data/dashboard.types";
import { MONTHS } from "src/utils/constants/general";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { convertToFloat } from "src/utils/parser";

const pallete = currentPallete();
const themeProfile = getThemeVars(true);

const lineOptions: any = (datasets: any[]) => {
    const layout = { autoPadding: true, padding: { top: 0, right: 40, left: 40 } };
    const datalabels = {
        anchor: "end",
        align: "top",
        color: pallete.text1,
        font: { weight: "bold", family: pallete.font2, size: 14 },
        formatter: (v: number, context: Context) => {
            return (
                "R$ " +
                v +
                "\n" +
                datasets[context.datasetIndex][context.dataIndex].delta +
                "%"
            );
        },
    };
    const legend = {
        labels: {
            color: pallete.text1,
            font: { weight: "bold", family: pallete.font2, size: 14 },
        },
    };

    const tooltip = { enabled: false };
    const minValue = Math.min(
        ...datasets.flatMap((arr) => arr.map((v: any) => v.savedValue)),
    );
    const maxValue = Math.max(
        ...datasets.flatMap((arr) => arr.map((v: any) => v.savedValue)),
    );

    const scales = {
        y: {
            display: false,
            stacked: false,
            min: minValue - minValue * (minValue > 0 ? 0 : -0.2),
            max: maxValue + 500,
        },
        x: { ticks: { color: pallete.text1, font: { weight: "bold", size: 14 } } },
    };

    return {
        layout,
        clip: false,
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            datalabels,
            tooltip,
            legend,
        },
        scales,
    };
};

export function piggyBanksProgressionChart(
    piggyBanksProgression: PiggyBanksProgressionType[],
    theme: string,
) {
    Chart.register(ChartDataLabels);
    return new Chart("piggy-banks-progression", {
        plugins: [ChartDataLabels],
        type: "bar",
        data: {
            labels: piggyBanksProgression[0].progression.map(
                (pb) => MONTHS[pb.month].short + "/" + pb.year,
            ),
            datasets: piggyBanksProgression.map((pb, i) => ({
                label: pb.bank,
                data: pb.progression.map((bm) => convertToFloat(bm.savedValue)),
                spacing: 1,
                borderWidth: themeProfile.borderWidth as number,
                borderRadius: themeProfile.borderRadius as number,
                backgroundColor: theme === "binary" ? "transparent" : tint(0.5, pb.color),
                borderColor: pb.color,
            })),
        },
        options: lineOptions(piggyBanksProgression.map((pbp) => pbp.progression)),
    });
}
