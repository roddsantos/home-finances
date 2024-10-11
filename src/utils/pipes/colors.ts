import { Pipe, PipeTransform } from "@angular/core";
@Pipe({
    name: "color",
    standalone: true,
})
export class ColorPipe implements PipeTransform {
    transform(value: string, format: string): string {
        const formatStringLength = format.length;
        if (formatStringLength == 2 && format.match(/^#?([a-f0-9]{2})$/))
            return value + format;
        return value;
    }
}
