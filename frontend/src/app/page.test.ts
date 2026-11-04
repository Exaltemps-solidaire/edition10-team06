import { describe, expect, it } from "vitest";
import { regrouperParEnseignant } from "./page";

const base = { classe: "CM1-A", date: "2026-10-12", questionnaireRecu: false };

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
