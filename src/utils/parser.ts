export const parseFilters = (data: any) => {
    let x = {};
    Object.keys(data).map((k) => {
        x = { ...x, [k]: data[k].toString() };
    });
    return x;
};
