"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    const { error } = await createClient().auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: false, // personne ne peut créer de compte depuis le site
      },
    });
    if (error) {
      setState("error");
      setMessage(error.message);
    } else {
      setState("sent");
    }
  }

  return (
    <main className="page login">
      <h1 className="title small">Codex</h1>
      {state === "sent" ? (
        <p>Lien envoyé à {email}. Ouvre-le sur cet appareil pour te connecter.</p>
      ) : (
        <form onSubmit={submit}>
          <label>
            Adresse e-mail
            <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <button disabled={state === "sending"}>
            {state === "sending" ? "Envoi…" : "Recevoir un lien de connexion"}
          </button>
          {state === "error" && <p className="error">{message}</p>}
        </form>
      )}
    </main>
  );
}
