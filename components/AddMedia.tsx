"use client";
/* eslint-disable @next/next/no-img-element */

import { useState, useTransition } from "react";
import { addMedia } from "@/app/admin/actions";
import { TYPE_SINGULAR, TYPES, type MediaType, type SearchResult } from "@/lib/media";

export function AddMedia() {
  const [type, setType] = useState<MediaType>("anime");
  const [q, setQ] = useState("");
  const [cover, setCover] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [pending, start] = useTransition();

  const searchable = type !== "jeu"; // les jeux s'ajoutent à la main pour l'instant

  function add(r: SearchResult) {
    start(async () => {
      const { error } = await addMedia({
        type,
        title: r.title,
        year: r.year,
        cover_url: r.cover,
        source: r.source,
        external_id: r.externalId || null,
        progress_total: r.total,
      });
      if (error) return setMessage(error);
      setMessage(`${r.title} ajouté.`);
      setResults([]);
      setQ("");
      setCover("");
    });
  }

  function addManually() {
    if (!q.trim()) return;
    add({ title: q.trim(), year: null, cover: cover.trim() || null, externalId: "", source: "manuel", total: null });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    if (!searchable) return addManually();
    setSearching(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/search?type=${type}&q=${encodeURIComponent(q)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Recherche impossible.");
      setResults(json.results);
      if (json.results.length === 0) setMessage("Aucun résultat. Essaie le titre original, ou ajoute-le à la main.");
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setSearching(false);
    }
  }

  return (
    <section className="add" aria-labelledby="add-title">
      <h2 id="add-title">Ajouter</h2>
      <form className="add-form" onSubmit={submit}>
        <label>
          Type
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value as MediaType);
              setResults([]);
              setMessage(null);
            }}
          >
            {(Object.keys(TYPES) as MediaType[]).map((k) => (
              <option key={k} value={k}>
                {TYPE_SINGULAR[k]}
              </option>
            ))}
          </select>
        </label>
        <label className="grow">
          Titre
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Berserk, Cyberpunk 2077…" />
        </label>
        {!searchable && (
          <label className="grow">
            Image de couverture (URL, facultatif)
            <input type="url" value={cover} onChange={(e) => setCover(e.target.value)} />
          </label>
        )}
        <button disabled={searching || pending}>
          {searchable ? (searching ? "Recherche…" : "Rechercher") : pending ? "Ajout…" : "Ajouter"}
        </button>
        {searchable && q.trim() && (
          <button type="button" className="ghost" onClick={addManually} disabled={pending}>
            Ajouter à la main
          </button>
        )}
      </form>

      {message && <p className="notice" role="status">{message}</p>}

      {results.length > 0 && (
        <ul className="results">
          {results.map((r) => (
            <li key={`${r.source}-${r.externalId}`}>
              <button type="button" className="result" onClick={() => add(r)} disabled={pending}>
                {r.cover ? <img src={r.cover} alt="" /> : <span className="thumb" />}
                <span>
                  {r.title}
                  <span className="meta">
                    {r.year ?? "Année inconnue"}
                    {r.total ? `, ${r.total} ${type === "manga" ? "chapitres" : "épisodes"}` : ""}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
