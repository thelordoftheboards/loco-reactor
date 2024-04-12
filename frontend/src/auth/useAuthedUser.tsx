import { QUERY_KEY } from '../constants/queryKeys'
import * as userLocalStorage from './authed-user.localstore'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

async function getUserEmpty(): Promise<AuthedUser | null> {
  return null
}

export interface AuthedUser {
  // Received from API
  token: string
  pid: string
  name: string
  is_verified: boolean
  // Calculated
  initials: string
}

interface IUseAuthedUser {
  user: AuthedUser | null
}

export function useAuthedUser(): IUseAuthedUser {
  const { data: user } = useQuery<AuthedUser | null>(
    [QUERY_KEY.user],

    async (): Promise<AuthedUser | null> => getUserEmpty(),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      initialData: userLocalStorage.getAuthedUser,
      onError: () => {
        userLocalStorage.removeAuthedUser()
      },
    }
  )

  useEffect(() => {
    if (!user) userLocalStorage.removeAuthedUser()
    else userLocalStorage.saveAuthedUser(user)
  }, [user])

  return {
    user: user ?? null,
  }
}
