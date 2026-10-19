import type { Metadata } from "next";
import { Chakra_Petch, Grenze_Gotisch } from "next/font/google";
import { Sky } from "@/components/Sky";
import "./globals.css";

const display = Grenze_Gotisch({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-display",
});
const body = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Codex – Gabin Clavier",
  description: "Films, séries, anime, manga et jeux : ce que je suis et où j’en suis.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable}`}>
      <body>
        <div className="site">
          <Sky />
          {children}
        </div>
      </body>
    </html>
  );
}
