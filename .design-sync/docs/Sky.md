---
category: Decor
---
Ciel nocturne animé en WebGL (galaxie, yeux, château, soleil, chemin de lumière) : le fond signature de Codex, derrière l'en-tête de chaque page.

## Utilisation

Sans props. Il se place en `position: absolute` en haut (860px de haut, fondu vers le bas) : il doit être le premier enfant d'un conteneur `.site`, et le contenu passe par-dessus dans `.page`.

```jsx
<div className="site">
  <Sky />
  <main className="page">
    <header className="masthead">
      <p className="eyebrow">Livre des choses vues</p>
      <h1 className="title">Codex</h1>
      <p className="lede">Ce que je regarde, lis et joue, et où j’en suis.</p>
    </header>
  </main>
</div>
```

Respecte « réduire les animations » (image fixe) et s'arrête de dessiner hors écran. Un seul `Sky` par page.
