import { Pipe, PipeTransform } from "@angular/core";
import { BillDataObjectType } from "src/app/core/types/data/bills.types";

@Pipe({
    name: "bills",
    standalone: true,
})
export class BillsPipe implements PipeTransform {
    transform(
        value: BillDataObjectType,
        format: "type" | "parcels" | "settled" | "flux"
    ) {
        if (format === "type") {
            if (value.type === "creditCard") return "credit card";
            if (value.type === "companyCredit") return "company credit";
            if (value.type === "money") return "money";
        }
        if (format === "parcels") {
            return `${value.parcel + 1}/${value.parcels}`;
        }
        if (format === "settled") {
            return value.settled
                ? !value.isPayment
                    ? "received"
                    : "paid"
                : "pending payment";
        }
        if (format === "flux") {
            return value.isPayment ? "outcome" : "income";
        }
        return value;
    }
}
