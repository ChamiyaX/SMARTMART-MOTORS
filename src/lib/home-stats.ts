export type HomeStatItem = {
  label: string;
  value: number;
  suffix: string;
};

export type HomeStatsContent = {
  eyebrow: string;
  title: string;
  description: string;
  items: HomeStatItem[];
};

export const DEFAULT_HOME_STATS: HomeStatsContent = {
  eyebrow: "By the numbers",
  title: "Proven on the road",
  description: "Figures that reflect a community of drivers who trust SmartMart Motors.",
  items: [
    { label: "Models in catalog", value: 2500, suffix: "+" },
    { label: "Happy customers", value: 1800, suffix: "+" },
    { label: "Brands stocked", value: 60, suffix: "+" },
    { label: "Years of service", value: 8, suffix: "+" },
  ],
};

export function parseHomeStats(content: unknown): HomeStatsContent {
  const record =
    content && typeof content === "object" ? (content as Record<string, unknown>) : {};

  let items = DEFAULT_HOME_STATS.items;

  if (Array.isArray(record.items)) {
    items = record.items.slice(0, 4).map((entry, index) => {
      const fallback = DEFAULT_HOME_STATS.items[index] || {
        label: "",
        value: 0,
        suffix: "+",
      };

      if (!entry || typeof entry !== "object") {
        return fallback;
      }

      const item = entry as Record<string, unknown>;
      const rawValue = Number(item.value);

      return {
        label: String(item.label || fallback.label),
        value: Number.isFinite(rawValue) ? rawValue : fallback.value,
        suffix: String(item.suffix ?? fallback.suffix),
      };
    });

    while (items.length < 4) {
      items.push(
        DEFAULT_HOME_STATS.items[items.length] || {
          label: "",
          value: 0,
          suffix: "+",
        }
      );
    }
  }

  return {
    eyebrow: String(record.eyebrow || DEFAULT_HOME_STATS.eyebrow),
    title: String(record.title || DEFAULT_HOME_STATS.title),
    description: String(record.description || DEFAULT_HOME_STATS.description),
    items,
  };
}
