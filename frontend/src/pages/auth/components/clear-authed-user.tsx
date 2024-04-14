import * as userLocalStorage from '../../../hooks/authed-user.localstore'
import { QUERY_KEY } from '../../../constants/queryKeys'
import { queryClient } from '../../../react-query/client'
import { useEffect } from 'react'

export default function ClearAuthedUser() {
  useEffect(() => {
    userLocalStorage.removeAuthedUser()
    queryClient.removeQueries([QUERY_KEY.user])
  }, [])
  return <></>
}
