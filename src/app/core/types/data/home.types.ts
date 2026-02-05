export type ItemTypes = "bill" | "bank" | "credit-card" | "company" | "category";

export type HomeSearchReturnItemType = {
    id: string;
    type: ItemTypes;
    title: string;
    description: string;
    date: string;
    value: number;
};

export type HomeSearchReturnSectionsType = {
    banks: HomeSearchReturnItemType[];
    bills: HomeSearchReturnItemType[];
    categories: HomeSearchReturnItemType[];
    companies: HomeSearchReturnItemType[];
    creditCards: HomeSearchReturnItemType[];
};
