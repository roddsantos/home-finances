import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "sector",
    standalone: true,
})
export class SectorPipe implements PipeTransform {
    transform(value: any, format?: "color" | "icon") {
        switch (format) {
            case "color":
                if (
                    value.type === "bank" ||
                    Object.getOwnPropertyDescriptor(value, "savings")
                )
                    return "var(--bank)";
                if (
                    value.type === "credit-card" ||
                    Object.getOwnPropertyDescriptor(value, "invoice")
                )
                    return "var(--credit-card)";
                if (
                    value.type === "category" ||
                    Object.getOwnPropertyDescriptor(value, "icon")
                )
                    return "var(--category)";
                if (
                    value.type === "bill" ||
                    Object.getOwnPropertyDescriptor(value, "parcels")
                )
                    return "var(--bill)";
                return "var(--company)";
            case "icon":
                if (
                    value.type === "bank" ||
                    Object.getOwnPropertyDescriptor(value, "savings")
                )
                    return "account_balance";
                if (
                    value.type === "credit-card" ||
                    Object.getOwnPropertyDescriptor(value, "invoice")
                )
                    return "credit_card";
                if (
                    value.type === "category" ||
                    Object.getOwnPropertyDescriptor(value, "icon")
                )
                    return "category";
                if (
                    value.type === "bill" ||
                    Object.getOwnPropertyDescriptor(value, "parcels")
                )
                    return "receipt_long";
                return "store";
            default:
                if (
                    value.type === "bank" ||
                    Object.getOwnPropertyDescriptor(value, "savings")
                )
                    return "bank";
                if (
                    value.type === "credit-card" ||
                    Object.getOwnPropertyDescriptor(value, "invoice")
                )
                    return "credit card";
                if (
                    value.type === "category" ||
                    Object.getOwnPropertyDescriptor(value, "icon")
                )
                    return "category";
                if (
                    value.type === "bill" ||
                    Object.getOwnPropertyDescriptor(value, "parcels")
                )
                    return "bill";
                return "company";
        }
    }
}
