import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getApiBase } from "../../utils/env";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: getApiBase(),
  }),
  tagTypes: ["Books", "Book", "Borrow"],
  endpoints: () => ({}),
});
