import { CategoryObjectType } from "../data/category.types";

export type CategorySummaryType = {
    category: CategoryObjectType | null;
    total: number;
    count: number;
    key: string;
};

export type CategoriesSummaryType = {
    topCategories: CategorySummaryType[];
    otherCategories: null | CategorySummaryType;
};
