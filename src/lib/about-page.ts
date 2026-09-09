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
    text: "We stock Chinese OEM-grade parts selected for fitment accuracy and durability.",
  },
  {
    title: "Honest guidance",
    text: "Tell us your vehicle — we'll help you match the right component the first time.",
  },
  {
    title: "Island-wide reach",
    text: "From Colombo to every district, we ship parts where you need them.",
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
        "Premium automotive spare parts trusted by workshops and drivers across Sri Lanka."
    ),
    mission: String(
      record.mission ||
        "We started with a simple idea: make reliable OEM-quality parts easier to find, price, and fit — without the noise of overhyped retail."
    ),
    story: String(
      record.story ||
        "Based in Sri Lanka, we serve retail customers, garages, and fleet operators with curated inventory spanning engine, braking, suspension, lighting, and electrical categories."
    ),
    imageUrl: String(record.imageUrl || DEFAULT_ABOUT_IMAGE),
    values,
  };
}
