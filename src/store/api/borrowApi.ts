import type {
  BorrowCreateInput,
  BorrowRecord,
  BorrowSummaryItem,
} from "../types/borrow";
import type { ApiEnvelope } from "../types/response";
import { baseApi } from "./baseApi";

export const borrowApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBorrow: builder.mutation<BorrowRecord, BorrowCreateInput>({
      query: (body) => ({ url: `/api/borrow`, method: "POST", body }),
      transformResponse: (res: ApiEnvelope<BorrowRecord>) => res.data,
      invalidatesTags: [
        { type: "Borrow", id: "SUMMARY" },
        { type: "Books", id: "LIST" },
      ],
    }),
    getBorrowSummary: builder.query<BorrowSummaryItem[], void>({
      query: () => ({ url: `/api/borrow` }),
      transformResponse: (res: ApiEnvelope<BorrowSummaryItem[]>) => res.data,
      providesTags: [{ type: "Borrow", id: "SUMMARY" }],
    }),
  }),
});

export const { useCreateBorrowMutation, useGetBorrowSummaryQuery } = borrowApi;
