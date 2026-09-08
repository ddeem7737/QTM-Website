import type { MetadataRoute } from "next";
import { industries, news, products, suppliers } from "./data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://qtm-group.com";
  const staticRoutes = ["", "/about-us", "/products", "/industries", "/suppliers", "/our-network", "/b2b", "/contact-us", "/news", "/request-a-quote", "/product-identification", "/search", "/privacy-policy", "/cookie-policy", "/terms"];
  return [
    ...staticRoutes.map((route) => ({ url: `${base}${route}`, changeFrequency: "monthly" as const })),
    ...products.map((item) => ({ url: `${base}/products/${item.slug}`, changeFrequency: "monthly" as const })),
    ...suppliers.map((item) => ({ url: `${base}/suppliers/${item.slug}`, changeFrequency: "monthly" as const })),
    ...industries.map((item) => ({ url: `${base}/industries/${item.slug}`, changeFrequency: "monthly" as const })),
    ...news.map((item) => ({ url: `${base}/news/${item.slug}`, changeFrequency: "weekly" as const })),
  ];
}
