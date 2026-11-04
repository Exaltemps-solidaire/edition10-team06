"use client";

import { useState } from "react";
import styles from "./page.module.css";

type Role = "admin" | "coordinatrice" | "animatrice";
type Membre = { id: string; nom: string; role: Role };

const MEMBRES: Membre[] = [
  { id: "m1", nom: "Admin Dupont", role: "admin" },
  { id: "m2", nom: "Sophie Martin (coordinatrice)", role: "coordinatrice" },
  { id: "m3", nom: "Karim Haddad (animateur)", role: "animatrice" },
];

type Seance = { id: string; enseignant: string; classe: string; date: string; questionnaireRecu: boolean };

const SEANCES_INITIALES: Seance[] = [
  { id: "s1", enseignant: "Mme Perrin", classe: "CM1-A", date: "2026-10-12", questionnaireRecu: false },
  { id: "s2", enseignant: "Mme Perrin", classe: "CM1-A", date: "2026-10-19", questionnaireRecu: false },
  { id: "s3", enseignant: "M. Roux", classe: "CE2-B", date: "2026-10-14", questionnaireRecu: false },
  { id: "s4", enseignant: "Mme Fabre", classe: "6e-C", date: "2026-10-15", questionnaireRecu: false },
];

// Une ligne par enseignant : plusieurs séances pour le même enseignant ne comptent qu'une fois.
export function regrouperParEnseignant(seances: Seance[]) {
  const vues = new Set<string>();
  const lignes: { enseignant: string; classe: string; ids: string[] }[] = [];
  for (const s of seances) {
    if (s.questionnaireRecu || vues.has(s.enseignant)) continue;
    vues.add(s.enseignant);
    lignes.push({
      enseignant: s.enseignant,
      classe: s.classe,
      ids: seances.filter((x) => x.enseignant === s.enseignant && !x.questionnaireRecu).map((x) => x.id),
    });
  }
  return lignes;
}

type Ecran = "qui" | "import" | "succes" | "chiffres" | "graphiques" | "questionnaires" | "envoye";

export default function Home() {
  const [utilisateur, setUtilisateur] = useState<Membre | null>(null);
  const [ecran, setEcran] = useState<Ecran>("qui");
  const [fichierImporte, setFichierImporte] = useState<string | null>(null);
  const [seances, setSeances] = useState<Seance[]>(SEANCES_INITIALES);
  const [selection, setSelection] = useState<Set<string>>(new Set());

  const lignesEnAttente = regrouperParEnseignant(seances);

  function envoyerQuestionnaires() {
    setSeances((prev) => prev.map((s) => (selection.has(s.enseignant) ? { ...s, questionnaireRecu: true } : s)));
    setSelection(new Set());
    setEcran("envoye");
  }

  return (
    <div className={styles.page}>
      <header style={{ display: "flex", justifyContent: "space-between", padding: "1rem 2rem", borderBottom: "1px solid #ddd" }}>
        <strong>Méditerranée 2000 · Sortie de projet</strong>
        {utilisateur && (
          <span>
            {utilisateur.nom} ({utilisateur.role}){" "}
            <button onClick={() => setEcran("qui")}>changer</button>
          </span>
        )}
      </header>

      <main style={{ padding: "2rem", maxWidth: 700, margin: "0 auto" }}>
        {ecran === "qui" && (
          <section>
            <h1>Qui êtes-vous ?</h1>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {MEMBRES.map((m) => (
                <li key={m.id} style={{ marginBottom: 8 }}>
                  <button
                    onClick={() => {
                      setUtilisateur(m);
                      setEcran("import");
                    }}
                  >
                    {m.nom} — {m.role}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {ecran === "import" && (
          <section>
            <h1>Importer le fichier</h1>
            <p>Fichier Excel du projet (classes, séances, inscriptions, communes).</p>
            <input
              type="file"
              accept=".xlsx"
              onChange={(e) => setFichierImporte(e.target.files?.[0]?.name ?? null)}
            />
            <br />
            <br />
            <button disabled={!fichierImporte} onClick={() => setEcran("succes")}>
              Importer
            </button>
          </section>
        )}

        {ecran === "succes" && (
          <section>
            <h1>Import réussi</h1>
            <p>« {fichierImporte} » importé.</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setEcran("chiffres")}>Chiffres clés</button>
              <button onClick={() => setEcran("graphiques")}>Graphiques</button>
              <button onClick={() => setEcran("questionnaires")}>Questionnaires en attente</button>
            </div>
          </section>
        )}

        {ecran === "chiffres" && (
          <section>
            <h1>Chiffres clés</h1>
            <ul>
              <li>Classes : 12</li>
              <li>Séances : 24</li>
              <li>Inscrits : 318</li>
              <li>Communes : 5</li>
            </ul>
            <button onClick={() => setEcran("succes")}>Retour</button>
          </section>
        )}

        {ecran === "graphiques" && (
          <section>
            <h1>Graphiques</h1>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-end", height: 160 }}>
              {[
                { label: "Classes", v: 12 },
                { label: "Séances", v: 24 },
                { label: "Communes", v: 5 },
              ].map((b) => (
                <div key={b.label} style={{ textAlign: "center" }}>
                  <div style={{ background: "#2563eb", width: 48, height: b.v * 5 }} />
                  <small>{b.label}</small>
                </div>
              ))}
            </div>
            <button onClick={() => setEcran("succes")}>Retour</button>
          </section>
        )}

        {ecran === "questionnaires" && (
          <section>
            <h1>Questionnaires en attente</h1>
            {lignesEnAttente.length === 0 && <p>Aucune séance en attente de questionnaire.</p>}
            <ul style={{ listStyle: "none", padding: 0 }}>
              {lignesEnAttente.map((l) => (
                <li key={l.enseignant}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selection.has(l.enseignant)}
                      onChange={(e) => {
                        const next = new Set(selection);
                        if (e.target.checked) next.add(l.enseignant);
                        else next.delete(l.enseignant);
                        setSelection(next);
                      }}
                    />{" "}
                    {l.enseignant} — {l.classe} ({l.ids.length} séance{l.ids.length > 1 ? "s" : ""})
                  </label>
                </li>
              ))}
            </ul>
            <button disabled={selection.size === 0} onClick={envoyerQuestionnaires}>
              Envoyer le questionnaire (en copie cachée)
            </button>
            <p>
              <button onClick={() => setEcran("succes")}>Retour</button>
            </p>
          </section>
        )}

        {ecran === "envoye" && (
          <section>
            <h1>Questionnaire envoyé</h1>
            <p>Le questionnaire a été envoyé en copie cachée. Rappel automatique prévu à 14 jours sans réponse.</p>
            <button onClick={() => setEcran("questionnaires")}>Retour aux questionnaires en attente</button>
          </section>
        )}
      </main>
    </div>
  );
}
