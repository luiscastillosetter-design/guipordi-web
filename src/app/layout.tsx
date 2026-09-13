import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Guipordi | Tecnología Sin Cortes",
  description: "Especialistas en equipos de respaldo eléctrico, Mini UPS, estaciones de energía e inversores. Mantén tu hogar y oficina siempre conectados.",
  metadataBase: new URL("https://guipordi.com"),
  openGraph: {
    title: "Guipordi | Energía Ininterrumpida",
    description: "Catálogo oficial. Descubre nuestras soluciones de energía y despídete de los apagones.",
    url: "https://guipordi.com",
    siteName: "Guipordi",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Guipordi - Soluciones de Energía",
      },
    ],
    locale: "es_VE", // Optimizado para Venezuela/Latam
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Guipordi | Tecnología Sin Cortes",
    description: "Especialistas en equipos de respaldo eléctrico. Mantén tu hogar y oficina siempre conectados.",
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.className} bg-[#030712] text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}