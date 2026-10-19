"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { MediaInput, MediaPatch } from "@/lib/media";
import { createClient } from "@/lib/supabase/server";

type Result = { error?: string };

// Seuls ces champs peuvent être écrits depuis l'interface
const ALLOWED = [
  "type", "status", "title", "cover_url", "year", "source", "external_id",
  "season", "progress", "progress_total", "rating", "notes",
] as const;

function clean(input: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const key of ALLOWED) if (key in input) out[key] = input[key];
  return out;
}

async function authedClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ? supabase : null;
}

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function addMedia(input: MediaInput): Promise<Result> {
  const supabase = await authedClient();
  if (!supabase) return { error: "Session expirée, reconnecte-toi." };
  const { error } = await supabase.from("media").insert(clean(input));
  if (error) return { error: error.message };
  refresh();
  return {};
}

export async function updateMedia(id: string, patch: MediaPatch): Promise<Result> {
  const supabase = await authedClient();
  if (!supabase) return { error: "Session expirée, reconnecte-toi." };
  const { error } = await supabase.from("media").update(clean(patch)).eq("id", id);
  if (error) return { error: error.message };
  refresh();
  return {};
}

export async function deleteMedia(id: string): Promise<Result> {
  const supabase = await authedClient();
  if (!supabase) return { error: "Session expirée, reconnecte-toi." };
  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) return { error: error.message };
  refresh();
  return {};
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
