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
  const query = useQuery<AuthedUser | null>({
    queryKey: [QUERY_KEY.user],
    queryFn: getUserEmpty,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    initialData: userLocalStorage.getAuthedUser,
  })

  useEffect(() => {
    if (query.error) {
      userLocalStorage.removeAuthedUser()
    }
  }, [query.error])

  useEffect(() => {
    if (query.data) userLocalStorage.saveAuthedUser(query.data)
  }, [query.data])

  return {
    user: query.data ?? null,
  }
}
