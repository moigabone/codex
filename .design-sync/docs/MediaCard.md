---
category: Media
---
Fiche d'un film, d'une série, d'un anime, d'un manga ou d'un jeu : affiche 2:3, pastille de type, note sur 10, barre de progression néon, titre, type · année et progression en cours.

## Utilisation

Toujours dans une grille d'étagère : `ul.grid > li > MediaCard`. La grille fixe la largeur (colonnes de 10rem minimum).

```jsx
<section className="shelf" data-status="en_cours">
  <div className="shelf-head">
    <h2>En cours</h2>
    <span className="count">1</span>
    <span className="rule" aria-hidden="true" />
  </div>
  <ul className="grid">
    <li>
      <MediaCard media={{
        id: "1", type: "anime", status: "en_cours", title: "Frieren", year: 2023,
        cover_url: null, source: "anilist", external_id: null, season: 2,
        progress: 6, progress_total: 10, rating: 9, notes: null, updated_at: "2026-10-19",
      }} />
    </li>
  </ul>
</section>
```

## Props

- `media` : l'objet complet. Champs qui changent le rendu :
  - `type` : `film` | `serie` | `anime` | `manga` | `jeu` (pastille et couverture de secours colorée par type).
  - `status` : `en_cours` | `en_pause` | `a_voir` | `termine` | `abandonne`. Une fiche `termine` masque le texte de progression.
  - `cover_url` : URL d'affiche ; `null` affiche l'initiale lumineuse sur un dégradé propre au type.
  - `rating` : 1 à 10 (pastille dorée), ou `null`.
  - `progress` / `progress_total` / `season` : texte « Saison 2, épisode 6 sur 10 » et barre. Pour un `jeu`, `progress` est un pourcentage (0-100).
  - `year` : affichée dans « Anime · 2023 ».
