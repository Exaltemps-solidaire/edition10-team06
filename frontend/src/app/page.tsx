"use client";

import { useState } from "react";
import styles from "./page.module.css";

type Role = "admin" | "coordinatrice" | "animatrice";
type Membre = { id: string; nom: string; role: Role };

const MEMBRES: Membre[] = [
  { id: "m1", nom: "Admin Dupont", role: "admin" },
  { id: "m2", nom: "Sophie Martin", role: "coordinatrice" },
  { id: "m3", nom: "Karim Haddad", role: "animatrice" },
];

const PROJET = {
  nom: "Prévention des déchets · CACPL 2025-2026",
  fichier: "CACPL_2025-2026.xlsx",
  classes: 170,
  seances: 256,
  communes: 4,
  eleves: 3986,
};

type Seance = { id: string; enseignant: string; classe: string; commune: string; date: string; questionnaireRecu: boolean };

// Échantillon réel du jeu de test (donnees/csv), projet CACPL : classes dont la dernière séance
// n'a pas encore de questionnaire renseigné (130 au total dans le jeu de test, 8 affichées ici).
const SEANCES_INITIALES: Seance[] = [
  { id: "s1", enseignant: "Mme Cyprès", classe: "CE2", commune: "Cannes", date: "2025-11-18", questionnaireRecu: false },
  { id: "s2", enseignant: "Mme Écume", classe: "CP", commune: "Le Cannet", date: "2025-11-20", questionnaireRecu: false },
  { id: "s3", enseignant: "Mme Falaise", classe: "CE1", commune: "Le Cannet", date: "2025-11-20", questionnaireRecu: false },
  { id: "s4", enseignant: "Mme Genêt", classe: "CP", commune: "Cannes", date: "2025-11-20", questionnaireRecu: false },
  { id: "s5", enseignant: "M. Iris", classe: "CP, CE1", commune: "Cannes", date: "2025-11-20", questionnaireRecu: false },
  { id: "s6", enseignant: "Mme Jasmin", classe: "CE1", commune: "Cannes", date: "2025-11-24", questionnaireRecu: false },
  { id: "s7", enseignant: "Mme Lentisque", classe: "CE1", commune: "Le Cannet", date: "2025-11-24", questionnaireRecu: false },
  { id: "s8", enseignant: "M. Myrte", classe: "CP", commune: "Le Cannet", date: "2025-11-24", questionnaireRecu: false },
];

// Une ligne par enseignant : plusieurs séances pour le même enseignant ne comptent qu'une fois.
export function regrouperParEnseignant(seances: Seance[]) {
  const vus = new Set<string>();
  const lignes: { enseignant: string; classe: string; commune: string; ids: string[] }[] = [];
  for (const s of seances) {
    if (s.questionnaireRecu || vus.has(s.enseignant)) continue;
    vus.add(s.enseignant);
    lignes.push({
      enseignant: s.enseignant,
      classe: s.classe,
      commune: s.commune,
      ids: seances.filter((x) => x.enseignant === s.enseignant && !x.questionnaireRecu).map((x) => x.id),
    });
  }
  return lignes;
}

type Ecran = "qui" | "succes" | "chiffres" | "graphiques" | "questionnaires" | "envoye";

export default function Home() {
  const [utilisateur, setUtilisateur] = useState<Membre | null>(null);
  const [ecran, setEcran] = useState<Ecran>("qui");
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
      <div className={styles.wrap}>
        <header className={styles.header}>
          <div>
            <div className={styles.brand}>Méditerranée 2000</div>
            <div>Rapports de projet</div>
            {utilisateur && <div className={styles.headerSub}>{PROJET.nom}</div>}
          </div>
          {utilisateur && (
            <div className={styles.whoami}>
              {utilisateur.nom}
              <br />
              <button onClick={() => setEcran("qui")}>changer</button>
            </div>
          )}
        </header>

        <div className={styles.content}>
          {ecran === "qui" && (
            <>
              <div className={styles.sectionTitle}>Qui êtes-vous ?</div>
              <ul className={styles.list}>
                {MEMBRES.map((m) => (
                  <li key={m.id}>
                    <button
                      className={styles.memberCard}
                      style={{ border: "none", width: "100%", textAlign: "left", font: "inherit" }}
                      onClick={() => {
                        setUtilisateur(m);
                        setEcran("succes");
                      }}
                    >
                      <span className={styles.memberName}>{m.nom}</span>
                      <span className={styles.memberRole}>{m.role}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {ecran === "succes" && (
            <>
              <div className={styles.successBanner}>
                <span style={{ fontSize: 24 }}>✓</span>
                <span>
                  <strong>{PROJET.fichier}</strong> importé : données déjà rassemblées pour {PROJET.nom}.
                </span>
              </div>
              <button className={styles.btnPrimary} onClick={() => setEcran("chiffres")}>
                Chiffres clés
              </button>
              <button className={styles.btnOutlineMer} onClick={() => setEcran("graphiques")}>
                Graphiques
              </button>
              <button className={styles.btnSecondary} onClick={() => setEcran("questionnaires")}>
                Questionnaires en attente ({lignesEnAttente.length})
              </button>
            </>
          )}

          {ecran === "chiffres" && (
            <>
              <div className={styles.sectionTitle}>Chiffres clés</div>
              <div className={styles.statGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{PROJET.classes}</div>
                  <div className={styles.statLabel}>Classes inscrites</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{PROJET.seances}</div>
                  <div className={styles.statLabel}>Séances réalisées</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{PROJET.eleves}</div>
                  <div className={styles.statLabel}>Élèves</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{PROJET.communes}</div>
                  <div className={styles.statLabel}>Communes</div>
                </div>
              </div>
              <button className={styles.btnSecondary} onClick={() => setEcran("succes")}>
                Retour
              </button>
            </>
          )}

          {ecran === "graphiques" && (
            <>
              <div className={styles.sectionTitle}>Graphiques</div>
              <div className={styles.bars}>
                {[
                  { label: "Classes", v: PROJET.classes, max: 300 },
                  { label: "Séances", v: PROJET.seances, max: 300 },
                  { label: "Communes", v: PROJET.communes, max: 10 },
                ].map((b) => (
                  <div className={styles.barRow} key={b.label}>
                    <span className={styles.barLabel}>{b.label}</span>
                    <div className={styles.barTrack}>
                      <div className={styles.barFill} style={{ width: `${Math.min(100, (b.v / b.max) * 100)}%` }} />
                    </div>
                    <span className={styles.barValue}>{b.v}</span>
                  </div>
                ))}
              </div>
              <button className={styles.btnSecondary} onClick={() => setEcran("succes")}>
                Retour
              </button>
            </>
          )}

          {ecran === "questionnaires" && (
            <>
              <div className={styles.sectionTitle}>Questionnaires en attente</div>
              <ul className={styles.list}>
                {lignesEnAttente.map((l) => (
                  <li className={styles.rowCard} key={l.enseignant}>
                    <label className={styles.rowLabel}>
                      <input
                        type="checkbox"
                        checked={selection.has(l.enseignant)}
                        onChange={(e) => {
                          const next = new Set(selection);
                          if (e.target.checked) next.add(l.enseignant);
                          else next.delete(l.enseignant);
                          setSelection(next);
                        }}
                      />
                      <span>
                        <div>{l.enseignant}</div>
                        <div className={styles.rowMeta}>
                          {l.classe} · {l.commune} · {l.ids.length} séance{l.ids.length > 1 ? "s" : ""}
                        </div>
                      </span>
                    </label>
                    <span className={styles.badge}>en attente</span>
                  </li>
                ))}
              </ul>
              <p className={styles.muted}>+ 122 autres classes sans questionnaire dans le jeu de test complet.</p>
              <button className={styles.btnPrimary} disabled={selection.size === 0} onClick={envoyerQuestionnaires}>
                Envoyer le questionnaire (en copie cachée)
              </button>
              <button className={styles.btnSecondary} onClick={() => setEcran("succes")}>
                Retour
              </button>
            </>
          )}

          {ecran === "envoye" && (
            <>
              <div className={styles.successBanner}>
                <span style={{ fontSize: 24 }}>✓</span>
                <span>
                  Questionnaire envoyé en copie cachée. <strong>Rappel automatique</strong> prévu à 14 jours sans réponse.
                </span>
              </div>
              <button className={styles.btnPrimary} onClick={() => setEcran("questionnaires")}>
                Retour aux questionnaires en attente
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
