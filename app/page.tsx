import Link from "next/link";
import { MediaCard } from "@/components/MediaCard";
import { SiteNav } from "@/components/SiteNav";
import { STATUSES, TYPES, type Media, type MediaStatus, type MediaType } from "@/lib/media";
import { createClient } from "@/lib/supabase/server";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const active = type && type in TYPES ? (type as MediaType) : null;

  const supabase = await createClient();
  let query = supabase.from("media").select("*").order("updated_at", { ascending: false });
  if (active) query = query.eq("type", active);
  const { data, error } = await query;
  const media = (data ?? []) as Media[];

  return (
    <main className="page">
      <SiteNav current="codex" />
      <header className="masthead">
        <p className="eyebrow">Livre des choses vues</p>
        <h1 className="title">Codex</h1>
        <p className="lede">Ce que je regarde, lis et joue, et où j’en suis.</p>
      </header>

      <nav className="filters" aria-label="Filtrer par type">
        <Link href="/" aria-current={active ? undefined : "page"}>Tout</Link>
        {(Object.keys(TYPES) as MediaType[]).map((key) => (
          <Link key={key} href={`/?type=${key}`} aria-current={active === key ? "page" : undefined}>
            {TYPES[key]}
          </Link>
        ))}
      </nav>

      {error && <p className="error">Impossible de charger la liste : {error.message}</p>}
      {!error && media.length === 0 && <p className="notice">Rien dans cette catégorie pour l’instant.</p>}

      {(Object.keys(STATUSES) as MediaStatus[]).map((status) => {
        const items = media.filter((m) => m.status === status);
        if (items.length === 0) return null;
        return (
          <section key={status} className="shelf" data-status={status}>
            <div className="shelf-head">
              <h2>{STATUSES[status]}</h2>
              <span className="count">{items.length}</span>
              <span className="rule" aria-hidden="true" />
            </div>
            <ul className="grid">
              {items.map((m) => (
                <li key={m.id}>
                  <MediaCard media={m} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </main>
  );
}
