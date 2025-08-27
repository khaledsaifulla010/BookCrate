import type { Book, CreateBookInput, Genre, UpdateBookInput } from "../types/book";
import type { ApiEnvelope } from "../types/response";
import { baseApi } from "./baseApi";



type ListParams = {
  filter?: Genre | "";
  sortBy?: string;
  sort?: "asc" | "desc";
  limit?: number;
};

export const booksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBooks: builder.query<Book[], ListParams | void>({
      query: (params) => {
        const search = new URLSearchParams();
        if (params?.filter) search.set("filter", params.filter);
        if (params?.sortBy) search.set("sortBy", params.sortBy);
        if (params?.sort) search.set("sort", params.sort);
        if (params?.limit) search.set("limit", String(params.limit));
        const qs = search.toString();
        return { url: `/api/books${qs ? `?${qs}` : ""}` };
      },
      transformResponse: (res: ApiEnvelope<Book[]>) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Book" as const, id: _id })),
              { type: "Books" as const, id: "LIST" },
            ]
          : [{ type: "Books" as const, id: "LIST" }],
    }),

    getBook: builder.query<Book, string>({
      query: (id) => ({ url: `/api/books/${id}` }),
      transformResponse: (res: ApiEnvelope<Book>) => res.data,
      providesTags: (_r, _e, id) => [{ type: "Book", id }],
    }),

    createBook: builder.mutation<Book, CreateBookInput>({
      query: (body) => ({ url: `/api/books`, method: "POST", body }),
      transformResponse: (res: ApiEnvelope<Book>) => res.data,
      invalidatesTags: [{ type: "Books", id: "LIST" }],
    }),

    updateBook: builder.mutation<Book, { id: string; body: UpdateBookInput }>({
      query: ({ id, body }) => ({
        url: `/api/books/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (res: ApiEnvelope<Book>) => res.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Book", id },
        { type: "Books", id: "LIST" },
      ],
    }),

    deleteBook: builder.mutation<{ ok: true }, string>({
      query: (id) => ({ url: `/api/books/${id}`, method: "DELETE" }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          booksApi.util.updateQueryData("getBooks", undefined, (draft) => {
            const idx = draft.findIndex((b) => b._id === id);
            if (idx !== -1) draft.splice(idx, 1);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: [{ type: "Books", id: "LIST" }],
    }),
  }),
});

export const {
  useGetBooksQuery,
  useGetBookQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
} = booksApi;
