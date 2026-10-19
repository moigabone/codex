import type { MetadataRoute } from "next";

// Application installable (téléphone, tablette) : s'ouvre directement sur la gestion
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Codex – Gabin Clavier",
    short_name: "Codex",
    description: "Films, séries, anime, manga et jeux : ce que je suis et où j’en suis.",
    lang: "fr",
    start_url: "/admin",
    scope: "/",
    display: "standalone",
    background_color: "#06051a",
    theme_color: "#06051a",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
