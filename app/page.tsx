import Link from "next/link";
import { MediaCard } from "@/components/MediaCard";
import { Shelf } from "@/components/Shelf";
import { SiteNav } from "@/components/SiteNav";
import {
  SORTS, STATUSES, TYPES, isSort, sortMedia,
  type Media, type MediaSort, type MediaStatus, type MediaType,
} from "@/lib/media";
import { createClient } from "@/lib/supabase/server";

function href(type: MediaType | null, sort: MediaSort) {
  const params = new URLSearchParams();
  if (type) params.set("type", type);
  if (sort !== "recent") params.set("tri", sort);
  const query = params.toString();
  return query ? `/?${query}` : "/";
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; tri?: string }>;
}) {
  const { type, tri } = await searchParams;
  const active = type && type in TYPES ? (type as MediaType) : null;
  const sort: MediaSort = isSort(tri) ? tri : "recent";

  const supabase = await createClient();
  let query = supabase.from("media").select("*");
  if (active) query = query.eq("type", active);
  const { data, error } = await query;
  const media = sortMedia((data ?? []) as Media[], sort);

  return (
    <main className="page">
      <SiteNav current="codex" />
      <header className="masthead">
        <p className="eyebrow">Livre des choses vues</p>
        <h1 className="title">Codex</h1>
        <p className="lede">Ce que je regarde, lis et joue, et où j’en suis.</p>
      </header>

      <div className="filters">
        <nav aria-label="Filtrer par type">
          <Link href={href(null, sort)} aria-current={active ? undefined : "page"}>Tout</Link>
          {(Object.keys(TYPES) as MediaType[]).map((key) => (
            <Link key={key} href={href(key, sort)} aria-current={active === key ? "page" : undefined}>
              {TYPES[key]}
            </Link>
          ))}
        </nav>
        <nav className="sorts" aria-label="Trier">
          <span>Trier</span>
          {(Object.keys(SORTS) as MediaSort[]).map((key) => (
            <Link key={key} href={href(active, key)} aria-current={sort === key ? "page" : undefined}>
              {SORTS[key]}
            </Link>
          ))}
        </nav>
      </div>

      {error && <p className="error">Impossible de charger la liste : {error.message}</p>}
      {!error && media.length === 0 && <p className="notice">Rien dans cette catégorie pour l’instant.</p>}

      {(Object.keys(STATUSES) as MediaStatus[]).map((status) => {
        const items = media.filter((m) => m.status === status);
        if (items.length === 0) return null;
        return (
          <Shelf key={status} status={status} label={STATUSES[status]} count={items.length} storageKey="accueil">
            <ul className="grid">
              {items.map((m) => (
                <li key={m.id}>
                  <MediaCard media={m} />
                </li>
              ))}
            </ul>
          </Shelf>
        );
      })}
    </main>
  );
}
