# Codex

Tracker de films, séries, anime, manga et jeux, avec ma progression.
Next.js (App Router) + Supabase (Postgres, authentification, RLS).

- `/` : page publique, classée par statut, filtrable par type
- `/admin` : ajout (recherche TMDB / AniList ou saisie manuelle) et suivi de progression
- `/login` : connexion par lien magique, réservée à ton compte

## Mise en route

1. **Supabase** : crée un projet sur supabase.com, puis exécute `supabase/schema.sql` dans le SQL Editor.
2. **Verrouiller l'accès** : dans Authentication, désactive les inscriptions (« Allow new users to sign up »),
   puis crée ton utilisateur à la main (Users > Add user) avec ton adresse e-mail.
   Dans URL Configuration, ajoute `http://localhost:3000/auth/callback` et ton URL de prod aux Redirect URLs.
3. **TMDB** : crée un compte sur themoviedb.org et récupère le jeton d'accès en lecture (API v4).
4. **Variables** : copie `.env.example` en `.env.local` et remplis-le.
5. `npm install` puis `npm run dev`, et ouvre http://localhost:3000/login.

## Mise en ligne sur gabin-clavier.fr

Le plus simple : importer le repo sur Vercel, renseigner les trois variables d'environnement,
puis ajouter le domaine `codex.gabin-clavier.fr` (Vercel indique l'enregistrement CNAME à créer chez ton registrar).
Pense à ajouter `https://codex.gabin-clavier.fr/auth/callback` dans les Redirect URLs de Supabase.

## Sécurité

- Lecture publique, écriture uniquement par le propriétaire de la ligne (RLS Postgres).
- Inscriptions désactivées + `shouldCreateUser: false` : personne d'autre ne peut se créer un compte.
- La recherche (`/api/search`) exige d'être connecté pour protéger le quota TMDB.
- Le champ `notes` est lisible publiquement : n'y mets rien de privé.

## Pistes pour la suite

- Jeux : brancher IGDB (via Twitch) pour la recherche automatique.
- Page de détail par média, historique de progression, statistiques annuelles.
