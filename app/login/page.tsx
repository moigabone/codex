"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "verifying" | "error">("idle");
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

  // Le code du mail sert dans l'app installée : sur iPhone, le lien s'ouvrirait dans Safari
  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setState("verifying");
    const { error } = await createClient().auth.verifyOtp({ email, token: code.trim(), type: "email" });
    if (error) {
      setState("sent");
      setMessage("Code invalide ou expiré.");
    } else {
      window.location.assign("/admin");
    }
  }

  return (
    <main className="page login">
      <h1 className="title small">Codex</h1>
      {state === "sent" || state === "verifying" ? (
        <form onSubmit={verify}>
          <p>Mail envoyé à {email}. Ouvre le lien, ou tape ici le code reçu.</p>
          <label>
            Code
            <input
              required
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6,10}"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </label>
          <button disabled={state === "verifying"}>{state === "verifying" ? "Vérification…" : "Se connecter"}</button>
          {message && <p className="error">{message}</p>}
        </form>
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
