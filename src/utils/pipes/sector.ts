import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "sector",
    standalone: true,
})
export class SectorPipe implements PipeTransform {
    transform(value: any, format?: "color") {
        if (format === "color") {
            console.log("heyyyy", value);
            if ("parcels" in value) return "var(--bill)";
            return value.color;
        } else {
            if ("savings" in value) return "bank";
            if ("invoice" in value) return "credit card";
            if ("icon" in value) return "category";
            if ("parcels" in value) return "bill";
            return "company";
        }
    }
}
