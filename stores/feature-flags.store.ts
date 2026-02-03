import { create } from "zustand";

interface FeatureFlags {
  [key: string]: boolean;
}

interface FeatureFlagsState {
  flags: FeatureFlags;
  setFlags: (flags: FeatureFlags) => void;
  setFlag: (key: string, value: boolean) => void;
}

export const useFeatureFlagsStore = create<FeatureFlagsState>((set) => ({
  flags: {
    upsell_prompts: true,
    live_sentiment: true,
  },
  setFlags: (flags) => set({ flags }),
  setFlag: (key, value) =>
    set((state) => ({
      flags: { ...state.flags, [key]: value },
    })),
}));
