import { Pipe, PipeTransform } from "@angular/core";
@Pipe({
    name: "color",
    standalone: true,
})
export class ColorPipe implements PipeTransform {
    private style = getComputedStyle(document.body);
    public text1 = this.style.getPropertyValue("--text-1");
    public text3 = this.style.getPropertyValue("--text-3");

    transform(value: string, format: string): string {
        const formatStringLength = format.length;
        const treatedString = value.split("#")[1];
        console.log(treatedString);
        if (!treatedString) return value;

        let r = parseInt(treatedString.substring(0, 2), 16); // hexToR - max 76,245
        let g = parseInt(treatedString.substring(2, 4), 16); // hexToG - max 149,685
        let b = parseInt(treatedString.substring(4, 6), 16); // hexToB - max 29,07
        if (formatStringLength == 2 && format.match(/^#?([a-f0-9]{2})$/))
            return "#" + treatedString + format;
        if (format === "contrast")
            return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? this.text1 : this.text3;
        if (format === "darker") {
            console.log(r, g, b, treatedString.substring(0, 2));
            r = r - 20 < 0 ? 0 : r - 20;
            g = g - 20 < 0 ? 0 : g - 20;
            b = b - 20 < 0 ? 0 : b - 20;
            console.log(
                r,
                g,
                b,
                treatedString,
                r.toString(16) + g.toString(16) + b.toString(16)
            );
            return "#" + r.toString(16) + g.toString(16) + b.toString(16);
        }
        return value;
    }
}
