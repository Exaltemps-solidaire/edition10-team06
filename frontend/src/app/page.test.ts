import { describe, expect, it } from "vitest";
import { agregerPivot, regrouperParEnseignant, relanceTelephoniqueDue, type Relance } from "./page";
import type { SeanceRecord } from "./data-cacpl";

const base = { classe: "CM1-A", commune: "Cannes", date: "2026-10-12", questionnaireRecu: false };

describe("regrouperParEnseignant", () => {
  it("ne garde qu'une ligne par enseignant même avec plusieurs séances", () => {
    const seances = [
      { id: "s1", enseignant: "Mme Perrin", ...base },
      { id: "s2", enseignant: "Mme Perrin", ...base },
    ];
    expect(regrouperParEnseignant(seances)).toHaveLength(1);
  });

  it("exclut les séances dont le questionnaire a déjà été reçu", () => {
    const seances = [{ id: "s1", enseignant: "M. Roux", ...base, questionnaireRecu: true }];
    expect(regrouperParEnseignant(seances)).toHaveLength(0);
  });
});

describe("agregerPivot", () => {
  const data: SeanceRecord[] = [
    { commune: "Cannes", niveau: "CP", cycle: "Cycle 2", mois: "déc. 2025", moisOrdre: "2025-12", eleves: 20 },
    { commune: "Cannes", niveau: "CE1", cycle: "Cycle 2", mois: "nov. 2025", moisOrdre: "2025-11", eleves: 15 },
    { commune: "Le Cannet", niveau: "CP", cycle: "Cycle 2", mois: "nov. 2025", moisOrdre: "2025-11", eleves: 10 },
  ];

  it("cumule la mesure par axe", () => {
    expect(agregerPivot(data, "commune", "eleves")).toEqual([
      { label: "Cannes", value: 35, ordre: "Cannes" },
      { label: "Le Cannet", value: 10, ordre: "Le Cannet" },
    ]);
  });

  it("trie l'axe mois par ordre chronologique plutôt que par valeur", () => {
    expect(agregerPivot(data, "mois", "seances").map((p) => p.label)).toEqual(["nov. 2025", "déc. 2025"]);
  });
});

describe("relanceTelephoniqueDue", () => {
  const maintenant = new Date("2026-11-10T00:00:00Z");

  it("n'est pas due avant 2 jours depuis la dernière relance mail", () => {
    const relances: Relance[] = [{ type: "mail", date: "2026-11-09T00:00:00Z" }];
    expect(relanceTelephoniqueDue(relances, maintenant)).toBe(false);
  });

  it("est due 2 jours ou plus après la dernière relance mail", () => {
    const relances: Relance[] = [{ type: "mail", date: "2026-11-08T00:00:00Z" }];
    expect(relanceTelephoniqueDue(relances, maintenant)).toBe(true);
  });

  it("n'est plus due si une relance téléphonique a déjà été tracée après la relance mail", () => {
    const relances: Relance[] = [
      { type: "mail", date: "2026-11-05T00:00:00Z" },
      { type: "telephone", date: "2026-11-09T00:00:00Z" },
    ];
    expect(relanceTelephoniqueDue(relances, maintenant)).toBe(false);
  });
});
