export function parseFilters(data: any) {
    let x = {};
    Object.keys(data).map((k) => {
        x = { ...x, [k]: data[k].toString() };
    });
    return x;
}

export function currencyDisplay(value: number) {
    return `${value.toFixed(2)} R$`;
}
