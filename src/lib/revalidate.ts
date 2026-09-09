import { revalidatePath } from "next/cache";

const CATALOGUE_ROUTES = ["/", "/products", "/categories", "/sitemap.xml"];

/**
 * Product, category and brand edits all surface on the same public routes, so a
 * write clears the whole catalogue instead of guessing which pages changed.
 * The `[slug]` entries clear every generated page of that dynamic segment.
 */
export function revalidateCatalogue() {
  for (const route of CATALOGUE_ROUTES) {
    revalidatePath(route);
  }
  revalidatePath("/products/[slug]", "page");
  revalidatePath("/categories/[slug]", "page");
}

/** Settings and page content feed the navbar, footer and static pages. */
export function revalidateSiteContent() {
  revalidatePath("/", "layout");
  revalidatePath("/about");
  revalidatePath("/sitemap.xml");
}

/** FAQ entries render on the public FAQ page and its structured data. */
export function revalidateFaqs() {
  revalidatePath("/faq");
}
