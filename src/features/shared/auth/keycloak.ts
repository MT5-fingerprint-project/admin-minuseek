import Keycloak from 'keycloak-js'
import {
  KEYCLOAK_CLIENT_ID,
  KEYCLOAK_REALM,
  KEYCLOAK_URL,
} from '@/features/shared/constants/global.constants'

type KeycloakEntry = {
  keycloak: Keycloak
  initialization: Promise<boolean>
}

let entry: KeycloakEntry | null = null
let activeKeycloak: Keycloak | null = null

export function setActiveKeycloak(keycloak: Keycloak): void {
  activeKeycloak = keycloak
}

export function getActiveKeycloak(): Keycloak | null {
  return activeKeycloak
}

export function getKeycloak(): KeycloakEntry {
  if (entry) {
    return entry
  }

  const keycloak = new Keycloak({
    url: KEYCLOAK_URL,
    realm: KEYCLOAK_REALM,
    clientId: KEYCLOAK_CLIENT_ID,
  })

  const initialization = keycloak.init({
    onLoad: 'login-required',
    pkceMethod: 'S256',
    checkLoginIframe: false,
  })

  entry = { keycloak, initialization }
  return entry
}
