export type AboutValue = {
  title: string;
  text: string;
};

export type AboutContent = {
  headline: string;
  body: string;
  mission: string;
  story: string;
  imageUrl: string;
  values: AboutValue[];
};

export const DEFAULT_ABOUT_IMAGE =
  "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1200&q=80";

export const DEFAULT_ABOUT_VALUES: AboutValue[] = [
  {
    title: "Quality first",
    text: "We focus on dependable electric tricycles selected for safety and durability.",
  },
  {
    title: "Honest guidance",
    text: "Tell us how you ride — we'll help you pick the right tricycle the first time.",
  },
  {
    title: "Island-wide reach",
    text: "From Colombo to every district, we deliver where you need them.",
  },
];

export function parseAboutContent(
  content: unknown,
  pageTitle?: string | null
): AboutContent {
  const record =
    content && typeof content === "object" ? (content as Record<string, unknown>) : {};

  let values = DEFAULT_ABOUT_VALUES;

  if (Array.isArray(record.values)) {
    values = record.values.slice(0, 3).map((entry, index) => {
      if (typeof entry === "string") {
        return {
          title: entry,
          text: DEFAULT_ABOUT_VALUES[index]?.text || "",
        };
      }

      if (entry && typeof entry === "object") {
        const value = entry as Record<string, unknown>;
        return {
          title: String(value.title || DEFAULT_ABOUT_VALUES[index]?.title || ""),
          text: String(value.text || DEFAULT_ABOUT_VALUES[index]?.text || ""),
        };
      }

      return DEFAULT_ABOUT_VALUES[index] || { title: "", text: "" };
    });

    while (values.length < 3) {
      values.push(DEFAULT_ABOUT_VALUES[values.length] || { title: "", text: "" });
    }
  }

  return {
    headline: String(record.headline || pageTitle || "About SmartMart Motors"),
    body: String(
      record.body ||
        "Best Electric Tricycle for Your Needs — trusted by riders across Sri Lanka."
    ),
    mission: String(
      record.mission ||
        "We started with a simple idea: make quality electric tricycles easier to find, compare, and buy — without the noise of overhyped retail."
    ),
    story: String(
      record.story ||
        "Based in Sri Lanka, we serve individuals and businesses looking for practical, efficient electric tricycles for daily transport and delivery."
    ),
    imageUrl: String(record.imageUrl || DEFAULT_ABOUT_IMAGE),
    values,
  };
}
