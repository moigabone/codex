import * as React from "react";
import { Sky } from "codex";

export const EnTete = () => (
  <div className="site" style={{ minHeight: 0, height: "620px" }}>
    <Sky />
    <main className="page">
      <header className="masthead" style={{ paddingTop: "4rem", minHeight: 0 }}>
        <p className="eyebrow">Livre des choses vues</p>
        <h1 className="title">Codex</h1>
        <p className="lede">Ce que je regarde, lis et joue, et où j’en suis.</p>
      </header>
    </main>
  </div>
);
