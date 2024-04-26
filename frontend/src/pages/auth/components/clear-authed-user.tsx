import { QUERY_KEY } from '../../../constants/queryKeys'
import * as userLocalStorage from '../../../hooks/authed-user.localstore'
import { queryClient } from '../../../react-query/client'
import { useEffect } from 'react'

export default function ClearAuthedUser() {
  useEffect(() => {
    userLocalStorage.removeAuthedUser()
    queryClient.removeQueries({ queryKey: [QUERY_KEY.user] })
  }, [])
  return <></>
}
