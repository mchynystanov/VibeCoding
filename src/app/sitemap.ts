import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/productOverrides";
import { SITE_URL } from "@/lib/siteConfig";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();

  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...products.map((product) => ({
      url: `${SITE_URL}/products/${product.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
