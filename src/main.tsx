import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import "./index.css";
import { App } from "./App.tsx";
import { initGoogleAnalytics } from "@/utils/googleAnalytics";

initGoogleAnalytics(import.meta.env.VITE_GA_MEASUREMENT_ID);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <App />
      <Toaster richColors closeButton position="top-right" />
    </ThemeProvider>
  </StrictMode>
);
