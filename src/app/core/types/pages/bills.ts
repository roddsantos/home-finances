import { BillDataObjectType } from "../data/bills.types";
import { FetchPaginatedData } from "../services";

export type BillsIncomeMetadataType = {
    income: Omit<FetchPaginatedData, "data">;
};

export type BillsMetadataType = FetchPaginatedData<BillDataObjectType> &
    BillsIncomeMetadataType;
