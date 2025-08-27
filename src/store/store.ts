import { configureStore } from "@reduxjs/toolkit";


export const store = configureStore({
  reducer: {
    // [baseApi.reducerPath]: baseApi.reducer,
  },
//   middleware: (getDefault) => getDefault().concat(baseApi.middleware),
//   devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
