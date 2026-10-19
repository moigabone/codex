"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState, useTransition } from "react";
import { deleteMedia, updateMedia } from "@/app/admin/actions";
import {
  STATUSES, TYPE_SINGULAR, UNIT, progressText,
  type Media, type MediaPatch, type MediaStatus,
} from "@/lib/media";

function toNumber(value: string) {
  return value.trim() === "" ? null : Number(value);
}

export function MediaRow({ media: m }: { media: Media }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  // Valeurs affichées tout de suite, sans attendre la réponse du serveur
  const [progress, setLocalProgress] = useState(m.progress);
  const [status, setLocalStatus] = useState(m.status);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setLocalProgress(m.progress);
    setLocalStatus(m.status);
  }, [m.progress, m.status]);

  const unit = UNIT[m.type];
  const step = m.type === "jeu" ? 5 : 1;
  const max = m.type === "jeu" ? 100 : m.progress_total ?? Infinity;

  function save(patch: MediaPatch) {
    start(async () => {
      const result = await updateMedia(m.id, patch);
      setError(result.error ?? null);
    });
  }

  function setProgress(next: number) {
    const value = Math.max(0, Math.min(max, next));
    // Statut automatique : on commence, ou on atteint la fin
    let nextStatus = status;
    if (status === "a_voir" && value > 0) nextStatus = "en_cours";
    if (value >= max && Number.isFinite(max)) nextStatus = "termine";
    setLocalProgress(value);
    setLocalStatus(nextStatus);
    // Un seul enregistrement quand on a fini de cliquer
    clearTimeout(timer.current);
    timer.current = setTimeout(() => save({ progress: value, status: nextStatus }), 400);
  }

  return (
    <div className="row" aria-busy={pending}>
      {m.cover_url ? (
        <img className="thumb" src={m.cover_url} alt="" />
      ) : (
        <span className="thumb" data-type={m.type} aria-hidden="true">
          {m.title.slice(0, 1)}
        </span>
      )}
      <div className="row-main">
        <p className="row-title">{m.title}</p>
        <p className="meta">
          {TYPE_SINGULAR[m.type]}
          {m.year ? ` · ${m.year}` : ""}
        </p>

        <div className="controls">
          <label>
            Statut
            <select
              value={status}
              onChange={(e) => {
                const next = e.target.value as MediaStatus;
                setLocalStatus(next);
                save({ status: next });
              }}
            >
              {(Object.keys(STATUSES) as MediaStatus[]).map((s) => (
                <option key={s} value={s}>
                  {STATUSES[s]}
                </option>
              ))}
            </select>
          </label>

          {(m.type === "serie" || m.type === "anime") && (
            <label>
              Saison
              <input
                type="number"
                min={1}
                defaultValue={m.season ?? ""}
                onBlur={(e) => {
                  const season = toNumber(e.target.value);
                  if (season !== m.season) save({ season });
                }}
              />
            </label>
          )}

          {unit && (
            <div className="stepper">
              <button type="button" onClick={() => setProgress(progress - step)} aria-label={`Reculer d’un ${unit}`}>
                −
              </button>
              <span>{progressText({ ...m, progress })}</span>
              <button type="button" onClick={() => setProgress(progress + step)} aria-label={`Avancer d’un ${unit}`}>
                +
              </button>
            </div>
          )}

          {unit && m.type !== "jeu" && (
            <label>
              Total
              <input
                type="number"
                min={0}
                defaultValue={m.progress_total ?? ""}
                onBlur={(e) => {
                  const progress_total = toNumber(e.target.value);
                  if (progress_total !== m.progress_total) save({ progress_total });
                }}
              />
            </label>
          )}

          <label>
            Note
            <select
              value={m.rating ?? ""}
              onChange={(e) => save({ rating: toNumber(e.target.value) })}
            >
              <option value="">Aucune</option>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}/10
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className="danger"
            disabled={pending}
            onClick={() => {
              if (!confirm(`Supprimer ${m.title} ?`)) return;
              start(async () => {
                const result = await deleteMedia(m.id);
                setError(result.error ?? null);
              });
            }}
          >
            Supprimer
          </button>
        </div>

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
