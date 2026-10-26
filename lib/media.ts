export const TYPES = {
  film: "Films",
  serie: "Séries",
  anime: "Anime",
  manga: "Manga",
  jeu: "Jeux",
} as const;
export type MediaType = keyof typeof TYPES;

export const TYPE_SINGULAR: Record<MediaType, string> = {
  film: "Film",
  serie: "Série",
  anime: "Anime",
  manga: "Manga",
  jeu: "Jeu",
};

// L'ordre ici est l'ordre d'affichage des étagères
export const STATUSES = {
  en_cours: "En cours",
  en_pause: "En pause",
  a_voir: "À voir",
  termine: "Terminé",
  abandonne: "Abandonné",
} as const;
export type MediaStatus = keyof typeof STATUSES;

// Unité de progression par type (null = pas de progression, ex. un film)
export const UNIT: Record<MediaType, string | null> = {
  film: null,
  serie: "épisode",
  anime: "épisode",
  manga: "chapitre",
  jeu: "%",
};

export type Media = {
  id: string;
  type: MediaType;
  status: MediaStatus;
  title: string;
  cover_url: string | null;
  year: number | null;
  source: string;
  external_id: string | null;
  season: number | null;
  progress: number;
  progress_total: number | null;
  rating: number | null;
  notes: string | null;
  updated_at: string;
};

export type MediaPatch = Partial<Omit<Media, "id" | "updated_at">>;
export type MediaInput = Pick<Media, "type" | "title"> & MediaPatch;

export type SearchResult = {
  title: string;
  year: number | null;
  cover: string | null;
  externalId: string;
  source: "tmdb" | "anilist" | "manuel";
  total: number | null;
};

export const SORTS = {
  recent: "Récents",
  note: "Note",
  titre: "Titre",
  annee: "Année",
} as const;
export type MediaSort = keyof typeof SORTS;

export function isSort(value: string | undefined): value is MediaSort {
  return !!value && value in SORTS;
}

// Titre comparable : sans accents, sans casse, espaces réduits
export function normalizeTitle(title: string): string {
  return title.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/\s+/g, " ").trim();
}

// Identité d'un média pour repérer les doublons : l'identifiant TMDB/AniList, sinon le titre
export function mediaKey(type: MediaType, source: string, externalId: string | null, title: string): string {
  return source !== "manuel" && externalId
    ? `${type}:${source}:${externalId}`
    : `${type}:titre:${normalizeTitle(title)}`;
}

const byTitle = (a: Media, b: Media) => a.title.localeCompare(b.title, "fr", { sensitivity: "base" });
const COMPARE: Record<MediaSort, (a: Media, b: Media) => number> = {
  recent: (a, b) => b.updated_at.localeCompare(a.updated_at),
  note: (a, b) => (b.rating ?? 0) - (a.rating ?? 0) || byTitle(a, b),
  titre: byTitle,
  annee: (a, b) => (b.year ?? 0) - (a.year ?? 0) || byTitle(a, b),
};

export function sortMedia(list: Media[], sort: MediaSort): Media[] {
  return [...list].sort(COMPARE[sort]);
}

export function progressText(m: Media): string | null {
  const unit = UNIT[m.type];
  if (!unit) return null;
  if (m.type === "jeu") return `${m.progress} %`;
  const season = m.season ? `Saison ${m.season}, ` : "";
  const total = m.progress_total ? ` sur ${m.progress_total}` : "";
  return `${season}${unit} ${m.progress}${total}`;
}

export function progressRatio(m: Media): number | null {
  if (m.type === "jeu") return Math.min(1, m.progress / 100);
  if (m.status === "termine") return 1;
  if (m.progress_total) return Math.min(1, m.progress / m.progress_total);
  return null;
}
