# AGENTS.md

Guide pour les agents IA et les humains qui travaillent sur `admin-minuseek`.

## Projet

`admin-minuseek` est une SPA React + Vite destinee aux equipes internes
Minuseek. Elle se connecte via Keycloak sur le realm systeme
`minuseek-system` et permet en v1 de gerer les tenants et les utilisateurs de
tenants.

## Stack

- React 19 + TypeScript + Vite 8
- pnpm
- Tailwind CSS 4
- shadcn/ui style `radix-luma`, composants dans `src/features/shared/ui`
- TanStack Query pour l'etat serveur
- TanStack Form + Zod pour les formulaires
- axios via `src/features/shared/lib/apiClient.ts`
- react-i18next, FR uniquement
- Docker Compose, port local `5174`

## Regles

- Aucun appel API direct dans les composants.
- Toute donnee distante passe par React Query.
- Toute mutation invalide les query keys concernees.
- Tous les textes visibles passent par `t('cle')`.
- Aucun chemin API en dur dans les composants ou hooks.
- Les routes API tenants restent centralisees dans
  `src/features/tenants/services/tenantAdminApiPaths.ts`.
- Le client admin utilise le realm systeme et ne doit jamais envoyer
  `X-Tenant-Slug`.
- `shared/` ne doit pas importer de feature metier.

## Architecture

```text
src/
  features/
    shared/
      auth/
      lib/
      ui/
    tenants/
      components/
      hooks/
      pages/
      services/
      types/
  locales/fr/translation.json
  main.tsx
```

## Commandes

```bash
pnpm lint
pnpm build
make dev
make lint
make build-pnpm
```

Le demarrage local standard:

```bash
cp .env.example .env
make dev
```
