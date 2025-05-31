import { Category } from "../objects";

export type CategorySummaryType = {
    category: Category | null;
    total: number;
    count: number;
    key: string;
};

export type CategoriesSummaryType = {
    topCategories: CategorySummaryType[];
    otherCategories: null | CategorySummaryType;
};
