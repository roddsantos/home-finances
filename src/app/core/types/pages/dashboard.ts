export type ChartConfigType = {
    theme: string;
    pallete: {
        primary: string;
        secondary: string;
        third: string;
    };
    color1: string;
    color2?: string;
    color3?: string;
};

export type PaidBillsChartType = {
    pending: number;
    paid: number;
};

export type MoneyLeftChartType = {
    savings: number;
    spent: number;
};
