// Donnees reelles du jeu de test impose (donnees/csv) : un resume par projet.
export type ProjetResume = {
  id: string;
  nom: string;
  anneeScolaire: string;
  statut: "planification" | "bilan";
  classesInscrites: number;
  seancesRealisees: number;
  seancesPrevues: number;
};

export const PROJETS: ProjetResume[] = [{"id": "01a19b45-b881-76cd-85d6-ac4263d52b10", "nom": "Culture du risque inondation · CAPG 2026-2027", "anneeScolaire": "2026-2027", "statut": "planification", "classesInscrites": 15, "seancesRealisees": 1, "seancesPrevues": 53}, {"id": "01a19b45-b933-78c8-858f-7eb666426014", "nom": "Biodiversité · CAPG 2026-2027", "anneeScolaire": "2026-2027", "statut": "planification", "classesInscrites": 10, "seancesRealisees": 0, "seancesPrevues": 30}, {"id": "01a19b45-b99e-75f4-b674-67387e9b56d2", "nom": "Les p'tits explorateurs · CAPG 2026-2027", "anneeScolaire": "2026-2027", "statut": "planification", "classesInscrites": 1, "seancesRealisees": 0, "seancesPrevues": 6}, {"id": "01a19b45-b9b2-765d-9d7f-8476bd37cd94", "nom": "Programme EDEN · Ville de Mougins 2026-2027", "anneeScolaire": "2026-2027", "statut": "planification", "classesInscrites": 23, "seancesRealisees": 0, "seancesPrevues": 52}, {"id": "01a19b45-ba36-71a0-ab0c-044dd16d3411", "nom": "Prévention des déchets · CACPL 2025-2026", "anneeScolaire": "2025-2026", "statut": "bilan", "classesInscrites": 170, "seancesRealisees": 256, "seancesPrevues": 256}];
