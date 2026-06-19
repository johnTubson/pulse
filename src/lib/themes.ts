export const THEMES = {
  violet: {
    label: "Violet",
    description: "Default — product UI, creative ops",
    accent: "#8b5cf6",
  },
  teal: {
    label: "Teal",
    description: "Fintech clean — trust, clarity",
    accent: "#2dd4bf",
  },
  steel: {
    label: "Steel",
    description: "Enterprise cool — neutral, precise",
    accent: "#38bdf8",
  },
  ember: {
    label: "Ember",
    description: "Warm ops — high-contrast alerts",
    accent: "#fb923c",
  },
} as const;

export type ThemeId = keyof typeof THEMES;

export const DEFAULT_THEME: ThemeId = "teal";

export const THEME_IDS = Object.keys(THEMES) as ThemeId[];

export function isThemeId(value: string): value is ThemeId {
  return value in THEMES;
}

export function getThemeAccent(theme: ThemeId): string {
  return THEMES[theme].accent;
}
