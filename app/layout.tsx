import type { Metadata, Viewport } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { LOCATIONS, SITE } from "./lib/data";
import PwaRegister from "./components/PwaRegister";
import InstallPrompt from "./components/InstallPrompt";

const display = Poppins({
  variable: "--font-display",
  weight: ["600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://www.yourpizzaexpress.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Pizza Express | Fresh Dough Daily — Order Pizza in the Ohio Valley",
    template: "%s | Pizza Express",
  },
  description:
    "Pizza Express is your locally owned pizzeria with fresh dough made daily and everything made-to-order. Order online or call for pickup, delivery & drive-thru in Warwood (Wheeling, WV), Bridgeport & Yorkville, OH.",
  keywords: [
    "Pizza Express",
    "pizza Wheeling WV",
    "pizza Bridgeport OH",
    "pizza Yorkville OH",
    "Warwood pizza",
    "pizza delivery Ohio Valley",
    "order pizza online",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Pizza Express — Not Fast Food, Great Food",
    description:
      "Fresh dough daily, made-to-order. Order online or call for pickup, delivery & drive-thru at our Warwood, Bridgeport & Yorkville locations.",
    url: siteUrl,
    siteName: "Pizza Express",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Pizza Express" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pizza Express — Not Fast Food, Great Food",
    description:
      "Fresh dough daily, made-to-order. Order online or call for pickup, delivery & drive-thru.",
    images: ["/og.png"],
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "Pizza Express",
    statusBarStyle: "default",
  },
  // Legacy iOS standalone flag for older iPhones (modern iOS uses the manifest).
  other: { "apple-mobile-web-app-capable": "yes" },
};

export const viewport: Viewport = {
  themeColor: "#e11b22",
  width: "device-width",
  initialScale: 1,
};

// Structured data so Google can show hours, locations & ordering links.
function StructuredData() {
  const graph = LOCATIONS.map((loc) => ({
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: `Pizza Express — ${loc.name}`,
    servesCuisine: "Pizza",
    image: `${siteUrl}/og.png`,
    url: siteUrl,
    telephone: loc.phone,
    priceRange: "$",
    menu: `${siteUrl}/#menu`,
    acceptsReservations: false,
    address: {
      "@type": "PostalAddress",
      streetAddress: loc.street,
      addressLocality: loc.cityState.split(",")[0].trim(),
      addressRegion: loc.cityState.split(",")[1]?.trim(),
      postalCode: loc.zip,
      addressCountry: "US",
    },
    potentialAction: {
      "@type": "OrderAction",
      target: loc.orderUrl,
      deliveryMethod: [
        "http://purl.org/goodrelations/v1#DeliveryModePickUp",
        "http://purl.org/goodrelations/v1#DeliveryModeOwnFleet",
      ],
    },
  }));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-cream text-charcoal">
        {children}
        <InstallPrompt />
        <PwaRegister />
        <StructuredData />
      </body>
    </html>
  );
}
