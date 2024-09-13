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

export function removeFields<T>(data: T, fields: Array<keyof T>) {
    const auxData = { ...data };
    fields.forEach((field) => {
        delete auxData[field];
    });
    return auxData;
}
