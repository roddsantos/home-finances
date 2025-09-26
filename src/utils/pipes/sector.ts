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
            if (Object.getOwnPropertyDescriptor(value, "savings")) return "bank";
            if (Object.getOwnPropertyDescriptor(value, "invoice")) return "credit card";
            if (Object.getOwnPropertyDescriptor(value, "icon")) return "category";
            if (Object.getOwnPropertyDescriptor(value, "parcels")) return "bill";
            return "company";
        }
    }
}
