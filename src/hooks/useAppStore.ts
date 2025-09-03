import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Language } from "@/types";

type AppState = {
  language: Language;
};

type AppActions = {
  updateState: (partialState: Partial<AppState>) => void;
  resetState: () => void;
};

type AppStore = AppState & AppActions;

const initialState: AppState = {
  language: Language.EN,
};

export const useAppStore = create<AppStore>()(
  devtools(
    (set) => ({
      ...initialState,

      updateState: (partialState: Partial<AppState>) => {
        set((state) => ({
          ...state,
          ...partialState,
        }));
      },

      resetState: () => {
        set(() => ({
          ...initialState,
        }));
      },
    }),
    { name: "app-store" }
  )
);
