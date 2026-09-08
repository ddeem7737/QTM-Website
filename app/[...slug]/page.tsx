import type { Metadata } from "next";
import QtmSite from "../components/QtmSite";
import { findIndustry, findProduct, findSupplier, news } from "../data";

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const [section, item] = slug;
  const product = section === "products" && item ? findProduct(item) : undefined;
  const supplier = section === "suppliers" && item ? findSupplier(item) : undefined;
  const industry = section === "industries" && item ? findIndustry(item) : undefined;
  const article = section === "news" && item ? news.find((n) => n.slug === item) : undefined;
  const title = product ? `${product.name} | QTM Group` : supplier ? `${supplier.name} | QTM Supplier Network` : industry ? `${industry.name} Industrial Solutions | QTM Group` : article ? `${article.title} | QTM News` : `${slug.map((s) => s.replace(/-/g, " ")).join(" · ")} | QTM Group`;
  const description = product?.description || supplier?.relationship || article?.excerpt || "Industrial belting, power transmission and regional technical support from QTM Group.";
  return { title, description, alternates: { canonical: `/${slug.join("/")}` }, openGraph: { title, description, type: article ? "article" : "website" } };
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return <QtmSite segments={slug} />;
}
