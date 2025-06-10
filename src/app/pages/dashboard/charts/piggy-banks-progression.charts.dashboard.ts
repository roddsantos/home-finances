import { currentPallete, tint } from "src/utils/color";
import { Chart } from "chart.js/auto";
import { Context } from "chartjs-plugin-datalabels";
import { PiggyBanksProgressionType } from "src/app/core/types/subjects/dashboard.subjects";
import { MONTHS } from "src/utils/constants/general";

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

export function piggyBanksProgressionChart(
    piggyBanksProgression: PiggyBanksProgressionType[],
    theme: string
) {
    return new Chart("piggy-banks-progression", {
        type: "line",
        data: {
            labels: piggyBanksProgression[0].progression.map(
                (pb) => MONTHS[pb.month].short + "/" + pb.year
            ),
            datasets: piggyBanksProgression.map((pb, i) => ({
                label: pb.bank,
                data: pb.progression.map((bm) => bm.savedValue),
                tension: 0.3,
                backgroundColor: theme === "binary" ? "transparent" : tint(0.3, pb.color),
                borderColor: pb.color,
                fill: true,
            })),
        },
        options: lineOptions(piggyBanksProgression.map((pbp) => pbp.progression)),
    });
}
