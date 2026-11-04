# Déploiement

Deux services, publiés sur les deux seuls ports routés par la plateforme : 8080 (front) et 8081 (API).

## Démarrer la plateforme (une fois)

```bash
podman ps --filter name=postgres.internal --quiet | grep -q . \
  || (cd /srv/team06/core-platform/core-platform && gitlab-ci-local --force-shell-executor)
podman exec postgres.internal psql -U postgres -c 'CREATE DATABASE team06;'
```

## Build, publier, lancer

```bash
podman build -t localhost:5000/team06/api:dev api
podman build -t localhost:5000/team06/frontend:dev frontend
podman push localhost:5000/team06/api:dev
podman push localhost:5000/team06/frontend:dev
APP=team06 podman compose -f podman-compose.yml -p team06 up -d --force-recreate
```

## Vérifier

```bash
curl -s localhost:8080/ && curl -s localhost:8081/health
```
