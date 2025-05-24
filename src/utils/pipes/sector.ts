import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "sector",
    standalone: true,
})
export class SectorPipe implements PipeTransform {
    transform(value: any, format?: "color") {
        if (format === "color") {
            if (value.parcels) return "var(--bill)";
            return value.color;
        } else {
            if (value.savings) return "bank";
            if (value.invoice) return "credit card";
            if (value.icon) return "category";
            if (value.parcels) return "bill";
            return "company";
        }
    }
}
