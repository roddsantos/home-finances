import { Pipe, PipeTransform } from "@angular/core";
import { Bill, BillData } from "src/app/core/types/objects";

@Pipe({
    name: "bills",
    standalone: true,
})
export class BillsPipe implements PipeTransform {
    transform(value: Bill & BillData, format: "type" | "parcels") {
        if (format === "type") {
            if (value.type === "creditCard") return "credit card";
            if (value.type === "companyCredit") return "company credit";
            if (value.type === "money") return "money";
        }
        if (format === "parcels") {
            return `${value.parcel + 1}/${value.parcels}`;
        }
        return value;
    }
}
