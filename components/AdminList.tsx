"use client";

import { useMemo, useState } from "react";
import { MediaRow } from "@/components/MediaRow";
import { Shelf } from "@/components/Shelf";
import {
  SORTS, STATUSES, TYPES, normalizeTitle, sortMedia,
  type Media, type MediaSort, type MediaStatus, type MediaType,
} from "@/lib/media";

export function AdminList({ media }: { media: Media[] }) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<MediaType | null>(null);
  const [sort, setSort] = useState<MediaSort>("recent");

  const shown = useMemo(() => {
    const q = normalizeTitle(search);
    const kept = media.filter((m) => (!type || m.type === type) && (!q || normalizeTitle(m.title).includes(q)));
    return sortMedia(kept, sort);
  }, [media, search, type, sort]);

  if (media.length === 0) {
    return <p className="notice">Ajoute ton premier média avec la recherche ci-dessus.</p>;
  }

  return (
    <>
      <div className="filters">
        <label className="search">
          <span className="visually-hidden">Chercher dans ma liste</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Chercher dans ma liste…"
          />
        </label>
        <div role="group" aria-label="Filtrer par type">
          <button type="button" aria-pressed={type === null} onClick={() => setType(null)}>Tout</button>
          {(Object.keys(TYPES) as MediaType[]).map((key) => (
            <button key={key} type="button" aria-pressed={type === key} onClick={() => setType(key)}>
              {TYPES[key]}
            </button>
          ))}
        </div>
        <div className="sorts" role="group" aria-label="Trier">
          <span>Trier</span>
          {(Object.keys(SORTS) as MediaSort[]).map((key) => (
            <button key={key} type="button" aria-pressed={sort === key} onClick={() => setSort(key)}>
              {SORTS[key]}
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 && <p className="notice">Aucun média ne correspond.</p>}

      {(Object.keys(STATUSES) as MediaStatus[]).map((status) => {
        const items = shown.filter((m) => m.status === status);
        if (items.length === 0) return null;
        return (
          <Shelf key={status} status={status} label={STATUSES[status]} count={items.length} storageKey="gestion">
            <ul className="rows">
              {items.map((m) => (
                <li key={m.id}>
                  <MediaRow media={m} />
                </li>
              ))}
            </ul>
          </Shelf>
        );
      })}
    </>
  );
}
