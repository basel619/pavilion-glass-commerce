import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getRouter } from "./router";
import { Toaster } from "sonner";
import { I18nProvider } from "./lib/i18n";
import "./styles.css";

const queryClient = new QueryClient();
const router = getRouter();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <RouterProvider router={router} />
        <Toaster theme="dark" position="top-center" richColors />
      </I18nProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
