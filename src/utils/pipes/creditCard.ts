import { Pipe, PipeTransform } from "@angular/core";
import { CreditCard } from "src/app/core/types/objects";

@Pipe({
    name: "creditCard",
    standalone: true,
})
export class CreditCardPipe implements PipeTransform {
    transform(value: CreditCard, format?: "status") {
        if (format === "status") {
            const dateDue = new Date(value.year, value.month, value.due, 23, 59, 59);
            if (value.isClosed) return "paid";
            if (
                dateDue.getMilliseconds() < new Date().getMilliseconds() &&
                !value.isClosed
            )
                return "pending";
            return "current";
        }
        return value.name;
    }
}
