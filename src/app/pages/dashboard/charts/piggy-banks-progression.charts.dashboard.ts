import { currentPallete, getThemeVars, tint } from "src/utils/color";
import { Chart } from "chart.js/auto";
import { Context } from "chartjs-plugin-datalabels";
import {
    MonthPiggyBankCountsType,
    PiggyBanksProgressionType,
} from "src/app/core/types/data/dashboard.types";
import { MONTHS } from "src/utils/constants/general";
import ChartDataLabels from "chartjs-plugin-datalabels";

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

    const tooltip = { enabled: false };
    const scales = {
        y: {
            display: false,
            stacked: true,
            min:
                Math.min(
                    ...datasets[0].map((v: MonthPiggyBankCountsType) => v.savedValue),
                    ...datasets[1].map((v: MonthPiggyBankCountsType) => v.savedValue),
                ) - 500,
            max:
                Math.max(
                    ...datasets[0].map((v: MonthPiggyBankCountsType) => v.savedValue),
                    ...datasets[1].map((v: MonthPiggyBankCountsType) => v.savedValue),
                ) + 500,
        },
        x: { ticks: { font: { weight: "bold", size: 12 } }, stacked: true },
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
                data: pb.progression.map((bm) => bm.savedValue),
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
