# admin-minuseek

Console interne Minuseek pour gerer les tenants et les utilisateurs de tenants.

## Demarrage

```bash
cp .env.example .env
make dev
```

L'app est disponible sur `http://localhost:5174`.

## Variables d'environnement

```bash
VITE_API_URL="http://localhost:3000/api"
VITE_KEYCLOAK_URL="http://localhost:8080"
VITE_KEYCLOAK_REALM="minuseek-system"
VITE_KEYCLOAK_CLIENT_ID="admin-minuseek"
```

L'admin utilise un token Keycloak du realm systeme. Le client HTTP n'envoie pas
de header `X-Tenant-Slug`.

## Docker

| Commande | Role |
|---|---|
| `make network` | Cree le reseau Docker partage `minuseek` |
| `make dev` | Lance Vite dans Docker avec hot reload |
| `make down` | Stoppe le container |
| `make logs` | Suit les logs |
| `make lint` | Lance `pnpm lint` dans Docker |
| `make build-pnpm` | Lance `pnpm build` dans Docker |

Le port interne Vite reste `5173`; le port expose localement est `5174`.

## Architecture

Le code applicatif vit dans `src/`.

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

Regles principales:

- Les composants n'appellent jamais `axios` directement.
- Les appels API passent par `features/*/services`.
- L'etat serveur passe par TanStack Query.
- Les formulaires passent par TanStack Form et Zod.
- Les textes visibles passent par `react-i18next`.
- Les chemins API tenants sont centralises dans `tenantAdminApiPaths.ts`.

## Routes API

Les routes back sont branchees via:

```ts
src/features/tenants/services/tenantAdminApiPaths.ts
```

Les methodes exposees au reste du front sont:

- `TenantAdminAPI.listTenants()`
- `TenantAdminAPI.createTenant(input)`
- `TenantAdminAPI.listTenantUsers(tenantSlug)`
- `TenantAdminAPI.createTenantUser(tenantSlug, input)`

Si le contrat back change, ajuster les chemins et les mappers dans `services/`.
