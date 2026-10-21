# Notes design-sync (Codex)

- Codex est une app Next.js, pas une bibliothèque : pas de `dist/`, pas de Storybook. Le bundle part de `.design-sync/entry.ts`, qui n'exporte que `MediaCard` et `Sky`. `AddMedia`, `MediaRow` (server actions Supabase) et `SiteNav` (`next/headers`) sont exclus via `componentSrcMap: null` : ils ne peuvent pas tourner hors du serveur.
- Lancer le convertisseur depuis la racine du dépôt avec `--node-modules ./node_modules` (le `entry` vient de la config). Pas de commande de build : le code source est bundlé directement par esbuild (alias `@/` résolus par le `tsconfig.json` racine).
- Polices : sur le site, `next/font` définit `--font-display` / `--font-body`. Ici, `.design-sync/fonts/` embarque les woff2 latin (Google Fonts, OFL) via `extraFonts`, et `.design-sync/tokens/fonts.css` (importé par `entry.ts`) redéfinit les deux variables. `tokensGlob` ne marche pas pour ça : il ne s'applique qu'à un paquet `tokensPkg`.
- Les `.d.ts` ne s'extraient pas sans `dist/` : props écrites à la main dans `dtsPropsFor` (copie du type `Media` de `lib/media.ts`).
- Catégories de docs sans accent (`Media`, `Decor`) : les accents donnent des slugs abîmés (`m-dias`).
- Les cartes d'aperçu ont un fond blanc : les aperçus de `MediaCard` sont posés sur `var(--night)`, sinon les titres blancs disparaissent. Même règle dans les conventions pour l'agent.
- Vérification : Playwright 1.64.1 dans `.ds-sync/` (correspond au Chromium 1248 en cache).

## Re-sync risks

- `dtsPropsFor.MediaCard` duplique le type `Media` de `lib/media.ts` : à mettre à jour à chaque ajout ou renommage de champ.
- Les polices de `.design-sync/fonts/` sont des copies figées : si `app/layout.tsx` change de police ou de graisses, re-télécharger et mettre à jour `fonts.css`.
- `.design-sync/conventions.md` cite des classes et variables de `app/globals.css` : revalider les noms après toute refonte du CSS.
- Un nouveau composant dans `components/` n'est PAS synchronisé automatiquement : l'ajouter à `entry.ts`, et à `componentSrcMap` s'il est affichable hors serveur (sinon `null`).
- `Sky` dépend de WebGL : rendu vérifié dans Chromium headless, à re-contrôler si le shader change.
