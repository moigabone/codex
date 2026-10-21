import * as React from "react";
import { MediaCard } from "codex";

type Media = React.ComponentProps<typeof MediaCard>["media"];

const base: Media = {
  id: "1", type: "anime", status: "en_cours", title: "Frieren", cover_url: null, year: 2023,
  source: "anilist", external_id: null, season: 2, progress: 6, progress_total: 10,
  rating: 9, notes: null, updated_at: "2026-10-19T20:00:00Z",
};

// Les fiches vivent sur le fond nuit de la page : sans lui, les titres blancs disparaissent
const Night = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: "var(--night)", padding: "1.25rem", display: "inline-block" }}>{children}</div>
);

const one = (media: Media) => (
  <Night>
    <ul className="grid" style={{ width: "11rem" }}>
      <li><MediaCard media={media} /></li>
    </ul>
  </Night>
);

export const EnCours = () => one(base);

export const JeuEnPourcentage = () =>
  one({ ...base, id: "2", type: "jeu", title: "Elden Ring", year: 2022, season: null, progress: 72, progress_total: null, rating: null });

export const FilmTermine = () =>
  one({ ...base, id: "3", type: "film", status: "termine", title: "Dune : Deuxième partie", year: 2024, season: null, progress: 0, progress_total: null, rating: 9 });

export const Etagere = () => (
  <Night>
  <section className="shelf" data-status="en_cours" style={{ width: "40rem", marginBottom: 0 }}>
    <div className="shelf-head">
      <h2>En cours</h2>
      <span className="count">3</span>
      <span className="rule" aria-hidden="true" />
    </div>
    <ul className="grid">
      <li><MediaCard media={{ ...base, id: "4", type: "manga", title: "Berserk", year: 1989, season: null, progress: 312, progress_total: 374, rating: 10 }} /></li>
      <li><MediaCard media={base} /></li>
      <li><MediaCard media={{ ...base, id: "5", type: "serie", title: "Dark", year: 2017, season: 1, progress: 4, progress_total: 26, rating: null }} /></li>
    </ul>
  </section>
  </Night>
);
