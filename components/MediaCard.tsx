/* eslint-disable @next/next/no-img-element */
import { TYPE_SINGULAR, progressRatio, progressText, type Media } from "@/lib/media";

export function MediaCard({ media: m }: { media: Media }) {
  const text = progressText(m);
  const ratio = progressRatio(m);

  return (
    <article className="card">
      <div className="cover" data-type={m.type}>
        {m.cover_url ? (
          <img src={m.cover_url} alt="" loading="lazy" />
        ) : (
          <span className="cover-fallback" aria-hidden="true">
            {m.title.slice(0, 1)}
          </span>
        )}
        <span className="badge">{TYPE_SINGULAR[m.type]}</span>
        {m.rating && <span className="badge rating">{m.rating}/10</span>}
        {ratio !== null && (
          <span className="bar" style={{ "--p": ratio } as React.CSSProperties} aria-hidden="true" />
        )}
      </div>
      <h3>{m.title}</h3>
      <p className="meta">
        {TYPE_SINGULAR[m.type]}
        {m.year ? ` · ${m.year}` : ""}
      </p>
      {text && m.status !== "termine" && <p className="progress">{text}</p>}
    </article>
  );
}
