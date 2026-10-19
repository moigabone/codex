import Link from "next/link";
import { cookies } from "next/headers";

export async function SiteNav({ current }: { current?: "codex" | "admin" }) {
  // Simple indice d'affichage : la vraie protection reste le middleware, la page admin et la RLS
  const signedIn = (await cookies()).getAll().some((c) => /^sb-.+-auth-token/.test(c.name));

  return (
    <nav className="site-nav" aria-label="Navigation principale">
      <span>Gabin Clavier</span>
      <div>
        <Link href="/" aria-current={current === "codex" ? "page" : undefined}>Codex</Link>
        <Link href="/admin" aria-current={current === "admin" ? "page" : undefined}>
          {signedIn || current === "admin" ? "Gérer" : "Connexion"}
        </Link>
      </div>
    </nav>
  );
}
