# Codex Nuit : conventions

Codex est un tracker personnel (films, séries, anime, manga, jeux) au style « dark fantasy » néon : fond bleu nuit, titres gothiques lumineux, accents or et rose. Interface **en français**.

## Mise en place

- Le texte est clair (`--text`) : **toujours poser le fond nuit**, sinon titres et textes deviennent invisibles. Enveloppe chaque écran dans `<div className="site">` (fond via `body` ou `style={{ background: "var(--night)" }}` sur un conteneur).
- `<Sky />` (ciel animé) = premier enfant de `.site`, un seul par page ; le contenu va dans `<main className="page">` (largeur max 74rem, passe au-dessus du ciel).
- Aucun provider requis. `MediaCard` attend un objet `media` complet (voir son `.d.ts`).

## Style : classes CSS + variables, pas de props de style

Variables (`var(--…)`) : `--night` fond, `--panel` surface translucide, `--well` bouton secondaire, `--seam` / `--seam-soft` bordures, `--text`, `--bright` titres de section, `--ash` / `--mist` texte secondaire, `--parchment` grand titre, `--gilt` or (actions, notes), `--neon` rose (progression, onglet actif), `--rose` texte de progression, `--link`, `--hover`, `--blood` erreurs. Polices : `--font-display` (Grenze Gotisch, titres) et `--font-body` (Chakra Petch, texte).

| Rôle | Classes |
|---|---|
| Structure | `site`, `page`, `site-nav`, `masthead`, `eyebrow` (surtitre or), `title` (grand titre lumineux), `lede` |
| Filtres | `filters` (barre collante ; liens avec `aria-current="page"` = actif, souligné néon) |
| Étagères | `shelf` + `data-status="en_cours|en_pause|a_voir|termine|abandonne"` (couleur d'accent), `shelf-head`, `count`, `rule`, `grid` |
| Fiche | `card`, `cover` + `data-type="film|serie|anime|manga|jeu"`, `badge`, `bar`, `meta`, `progress` |
| Formulaires | `<label>` (grille), `input`, `select` déjà stylés ; `<button>` = or plein ; `button.ghost` = contour ; `button.danger` = rouge |
| Panneaux / listes | `add` (panneau translucide), `rows` / `row` / `row-main` / `row-title`, `controls`, `stepper`, `notice`, `error` |

Pour un nouveau bloc : réutilise ces variables et classes ; titres de section en `font-family: var(--font-display)`.

## Où lire la vérité

`styles.css` importe `_ds_bundle.css` (tout le CSS du site : variables `:root`, classes ci-dessus) et `fonts/fonts.css`. Lis-le avant de styler. Doc par composant : `MediaCard.prompt.md`, `Sky.prompt.md`.

## Exemple

```jsx
<div className="site">
  <Sky />
  <main className="page">
    <header className="masthead">
      <p className="eyebrow">Livre des choses vues</p>
      <h1 className="title">Codex</h1>
    </header>
    <section className="shelf" data-status="en_cours">
      <div className="shelf-head">
        <h2>En cours</h2><span className="count">1</span><span className="rule" aria-hidden="true" />
      </div>
      <ul className="grid">
        <li><MediaCard media={{ id: "1", type: "anime", status: "en_cours", title: "Frieren", cover_url: null, year: 2023, source: "anilist", external_id: null, season: 2, progress: 6, progress_total: 10, rating: 9, notes: null, updated_at: "2026-10-19" }} /></li>
      </ul>
    </section>
  </main>
</div>
```
