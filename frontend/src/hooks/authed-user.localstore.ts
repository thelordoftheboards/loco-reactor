import { AuthedUser } from './use-authed-user'

export const LOCAL_STORAGE_KEY_AUTHED_USER = 'authed-user'

export function saveAuthedUser(user: AuthedUser): void {
  localStorage.setItem(LOCAL_STORAGE_KEY_AUTHED_USER, JSON.stringify(user))
}

function parseUserAndAddInitials(strUser: string): AuthedUser {
  const authedUser: AuthedUser = JSON.parse(strUser)

  try {
    const arrName = authedUser.name.split(' ')
    authedUser.initials = arrName[0].charAt(0).toUpperCase()
    if (arrName.length > 1) {
      authedUser.initials += arrName[1].charAt(0).toUpperCase()
    }
  } catch (err) {
    authedUser.initials = '?'
  }

  return authedUser
}

export function getAuthedUser(): AuthedUser | null {
  const user = localStorage.getItem(LOCAL_STORAGE_KEY_AUTHED_USER)

  return user ? parseUserAndAddInitials(user) : null
}

export function removeAuthedUser(): void {
  localStorage.removeItem(LOCAL_STORAGE_KEY_AUTHED_USER)
}
