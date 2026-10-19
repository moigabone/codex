import { NextResponse, type NextRequest } from "next/server";
import type { SearchResult } from "@/lib/media";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  // Réservé à toi : évite qu'un inconnu consomme ton quota TMDB
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Connexion requise." }, { status: 401 });

  const q = req.nextUrl.searchParams.get("q")?.trim();
  const type = req.nextUrl.searchParams.get("type");
  if (!q) return NextResponse.json({ results: [] });

  try {
    if (type === "film" || type === "serie") {
      return NextResponse.json({ results: await searchTmdb(q, type) });
    }
    if (type === "anime" || type === "manga") {
      return NextResponse.json({ results: await searchAnilist(q, type) });
    }
    return NextResponse.json({ results: [] });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }
}

type TmdbItem = {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path?: string | null;
};

async function searchTmdb(q: string, type: "film" | "serie"): Promise<SearchResult[]> {
  const token = process.env.TMDB_TOKEN;
  if (!token) throw new Error("TMDB_TOKEN manque dans .env.local.");
  const kind = type === "film" ? "movie" : "tv";
  const res = await fetch(
    `https://api.themoviedb.org/3/search/${kind}?query=${encodeURIComponent(q)}&language=fr-FR`,
    { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
  );
  if (!res.ok) throw new Error(`TMDB a répondu ${res.status}.`);
  const json = (await res.json()) as { results: TmdbItem[] };
  return json.results.slice(0, 10).map((r) => ({
    title: r.title ?? r.name ?? "Sans titre",
    year: yearOf(r.release_date ?? r.first_air_date),
    cover: r.poster_path ? `https://image.tmdb.org/t/p/w342${r.poster_path}` : null,
    externalId: String(r.id),
    source: "tmdb",
    total: null,
  }));
}

type AniItem = {
  id: number;
  title: { romaji: string | null; english: string | null };
  coverImage: { large: string | null } | null;
  startDate: { year: number | null } | null;
  episodes: number | null;
  chapters: number | null;
};

const ANILIST_QUERY = `
query ($search: String, $type: MediaType) {
  Page(perPage: 10) {
    media(search: $search, type: $type) {
      id
      title { romaji english }
      coverImage { large }
      startDate { year }
      episodes
      chapters
    }
  }
}`;

async function searchAnilist(q: string, type: "anime" | "manga"): Promise<SearchResult[]> {
  const res = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      query: ANILIST_QUERY,
      variables: { search: q, type: type === "anime" ? "ANIME" : "MANGA" },
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`AniList a répondu ${res.status}.`);
  const json = (await res.json()) as { data: { Page: { media: AniItem[] } } };
  return json.data.Page.media.map((m) => ({
    title: m.title.english ?? m.title.romaji ?? "Sans titre",
    year: m.startDate?.year ?? null,
    cover: m.coverImage?.large ?? null,
    externalId: String(m.id),
    source: "anilist",
    total: (type === "anime" ? m.episodes : m.chapters) ?? null,
  }));
}

function yearOf(date?: string) {
  const y = date ? Number(date.slice(0, 4)) : NaN;
  return Number.isFinite(y) && y > 0 ? y : null;
}
