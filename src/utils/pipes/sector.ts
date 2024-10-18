import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "sector",
    standalone: true,
})
export class SectorPipe implements PipeTransform {
    transform(value: string) {
        if (value === "credit-card") return "credit card";
        else return value;
    }
}
