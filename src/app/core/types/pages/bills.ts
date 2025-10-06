import { PaginationType } from "../components";
import { Bill, BillData } from "../objects";
import { FetchPaginatedData } from "../services";

export type BillsIncomeMetadataType = {
    income: Omit<FetchPaginatedData, "data">;
};

export type BillsMetadataType = FetchPaginatedData<Bill & BillData> &
    BillsIncomeMetadataType;
