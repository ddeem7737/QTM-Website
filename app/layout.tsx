import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://qtm-group.amber-stork-1273.chatgpt.site"),
  title: "QTM Group | Industrial Belts and Power Transmission Solutions",
  description: "QTM Group supplies industrial and agricultural belts, conveyor solutions, roller chains, sprockets, bearings and industrial spare parts across Central Asia, the Middle East and the CIS region.",
  icons: {
    icon: [{ url: "/qtm-favicon-large-v5.ico", sizes: "any" }, { url: "/qtm-favicon-large-v5.png", type: "image/png", sizes: "256x256" }],
    shortcut: "/qtm-logo-tab-centered-v4.ico",
    apple: "/qtm-logo-tab-centered-v4.png",
  },
  openGraph: { title: "QTM Group | Industrial Belts and Power Transmission Solutions", description: "Global industrial technology. Delivered regionally.", type: "website", images: ["/assets/hero.png"] },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "QTM Group — Quality Team Management",
  url: "https://qtm-group.com",
  description: "Independent regional industrial-solutions provider serving Central Asia, the Middle East and the CIS region.",
  foundingDate: "2020",
  areaServed: ["Central Asia", "Middle East", "CIS region"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}/>{children}</body></html>;
}
