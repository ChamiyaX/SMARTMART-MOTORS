const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  "engine-parts":
    "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1200&q=80",
  "brake-system":
    "https://images.unsplash.com/photo-1619642751034-765df036d329?auto=format&fit=crop&w=1200&q=80",
  suspension:
    "https://images.unsplash.com/photo-1493238792000-8113da027948?auto=format&fit=crop&w=1200&q=80",
  electrical:
    "https://images.unsplash.com/photo-1625047509248-ec889cbff124?auto=format&fit=crop&w=1200&q=80",
  "body-parts":
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
  filters:
    "https://images.unsplash.com/photo-1487754180451-c747872ea174?auto=format&fit=crop&w=1200&q=80",
  lighting:
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
  transmission:
    "https://images.unsplash.com/photo-1617814076367-b759117417fc?auto=format&fit=crop&w=1200&q=80",
  engine:
    "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1200&q=80",
  brakes:
    "https://images.unsplash.com/photo-1619642751034-765df036d329?auto=format&fit=crop&w=1200&q=80",
  accessories:
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
  "electric-three-wheeler":
    "https://images.unsplash.com/photo-1593941707874-ef6529ba8caa?auto=format&fit=crop&w=1200&q=80",
};

const FALLBACK_CATEGORY_IMAGE =
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80";

export function getDefaultCategoryImage(slug: string) {
  return DEFAULT_CATEGORY_IMAGES[slug] ?? FALLBACK_CATEGORY_IMAGE;
}

export function resolveCategoryImage(
  category: { slug: string; image?: string | null },
  productCover?: string | null
) {
  const trimmed = category.image?.trim();
  if (trimmed) return trimmed;
  if (productCover?.trim()) return productCover.trim();
  return getDefaultCategoryImage(category.slug);
}
