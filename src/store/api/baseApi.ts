import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getApiBase } from "../../utils/env";


export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: getApiBase(),
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Books", "Book", "Borrow"],
  endpoints: () => ({}),
});
