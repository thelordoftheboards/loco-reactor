import { apiPost } from '../../../utils/api'
import * as userLocalStorage from '../../../hooks/authed-user.localstore'
import { AuthedUser } from '../../../hooks/use-authed-user'
import { UseMutationResult, useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

async function signIn(email: string, password: string): Promise<AuthedUser> {
  // @ts-expect-error we expect a user type
  return apiPost('auth/sign-in', { email, password })
}

type ISignInMutation = UseMutationResult<
  AuthedUser,
  unknown,
  {
    email: string
    password: string
  },
  unknown
>

export function useSignInMutation(): ISignInMutation {
  const navigate = useNavigate()

  const signInMutation = useMutation<
    AuthedUser,
    unknown,
    { email: string; password: string },
    unknown
  >(({ email, password }) => signIn(email, password), {
    onSuccess: (data) => {
      // We will not store the results into react query. When the user navigates to a page
      // that has 'withAuthedUser', the query results will be empty and this will force call
      // to userLocalStorage.getAuthedUser, which in turn will load the user data and
      // set the initials for the user
      // queryClient.setQueryData([QUERY_KEY.user], data)
      userLocalStorage.saveAuthedUser(data)

      navigate('/')
    },
    onError: (_err) => {
      userLocalStorage.removeAuthedUser()
    },
  })

  return signInMutation
}
