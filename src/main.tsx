import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";


import router from "./router/Router";

import "@/index.css";
import { store } from "./store/store";
import { RouterProvider } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
