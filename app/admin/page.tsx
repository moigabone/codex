import { redirect } from "next/navigation";
import { AddMedia } from "@/components/AddMedia";
import { MediaRow } from "@/components/MediaRow";
import { SiteNav } from "@/components/SiteNav";
import type { Media } from "@/lib/media";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

export default async function Admin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase.from("media").select("*").order("updated_at", { ascending: false });
  const media = (data ?? []) as Media[];

  return (
    <main className="page admin">
      <SiteNav current="admin" />
      <header className="admin-head">
        <div>
          <p className="eyebrow">Archives</p>
          <h1>Gérer le codex</h1>
        </div>
        <form action={signOut}>
          <button className="ghost">Se déconnecter</button>
        </form>
      </header>

      <AddMedia />

      <section>
        <h2>Ma liste</h2>
        {media.length === 0 ? (
          <p className="notice">Ajoute ton premier média avec la recherche ci-dessus.</p>
        ) : (
          <ul className="rows">
            {media.map((m) => (
              <li key={m.id}>
                <MediaRow media={m} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
