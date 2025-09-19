const GA_SCRIPT_BASE = "https://www.googletagmanager.com/gtag/js";

type DataLayerEntry = IArguments;

declare global {
  interface Window {
    dataLayer: DataLayerEntry[];
    gtag: (...args: unknown[]) => void;
  }
}

const appendGaScript = (measurementId: string): void => {
  const existingScript = document.querySelector<HTMLScriptElement>(
    `script[src^="${GA_SCRIPT_BASE}"][data-gtag-id="${measurementId}"]`
  );

  if (existingScript) {
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = `${GA_SCRIPT_BASE}?id=${measurementId}`;
  script.dataset.gtagId = measurementId;
  (document.head || document.documentElement).appendChild(script);
};

const ensureDataLayer = (): void => {
  if (!window.dataLayer) {
    window.dataLayer = [] as unknown as DataLayerEntry[];
  }

  if (!window.gtag) {
    window.gtag = function gtag() {
      // Mirror the official snippet so GA reads queued calls correctly.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };
  }
};

export const initGoogleAnalytics = (measurementId?: string): void => {
  if (typeof window === "undefined") {
    return;
  }

  if (!measurementId) {
    if (import.meta.env.DEV) {
      console.warn(
        "[analytics] VITE_GA_MEASUREMENT_ID not set; Google Analytics not initialised."
      );
    }
    return;
  }

  ensureDataLayer();
  appendGaScript(measurementId);

  window.gtag("js", new Date());
  window.gtag("config", measurementId);
};

export {};
