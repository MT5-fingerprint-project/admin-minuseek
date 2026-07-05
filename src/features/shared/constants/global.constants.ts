function readRequiredViteEnv(name: string): string {
  const value = import.meta.env[name]
  if (!value) {
    throw new Error(`Missing required Vite environment variable: ${name}`)
  }
  return value
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '')
}

export const API_URL = trimTrailingSlash(readRequiredViteEnv('VITE_API_URL'))
export const KEYCLOAK_URL = trimTrailingSlash(readRequiredViteEnv('VITE_KEYCLOAK_URL'))
export const KEYCLOAK_REALM = readRequiredViteEnv('VITE_KEYCLOAK_REALM')
export const KEYCLOAK_CLIENT_ID = readRequiredViteEnv('VITE_KEYCLOAK_CLIENT_ID')
