// Service api du gabarit : écoute sur PORT (8081 par défaut), journaux sur la sortie standard.
// Lancé directement par Node (suppression des types TypeScript), sans étape de compilation.
import { createServer } from "node:http";
import { router } from "./routes.ts";

const port = Number(process.env.PORT ?? 8081);

const serveur = createServer((req, res) => {
  const { statut, corps } = router(req.method ?? "GET", req.url ?? "/");
  if (corps === undefined) {
    res.writeHead(statut).end();
  } else {
    res.writeHead(statut, { "Content-Type": "application/json" }).end(JSON.stringify(corps));
  }
});

serveur.listen(port, () => console.log(`api : à l'écoute sur le port ${port}`));

// Arrêt propre : le conteneur reçoit SIGTERM, on termine les requêtes en cours avant de sortir.
for (const signal of ["SIGTERM", "SIGINT"] as const) {
  process.on(signal, () => {
    console.log(`api : ${signal} reçu, arrêt`);
    serveur.close(() => process.exit(0));
  });
}
