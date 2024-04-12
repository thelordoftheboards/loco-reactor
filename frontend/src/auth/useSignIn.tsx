import { apiPost } from '../data/api'
import { ResponseError } from '../utils/Errors/ResponseError'
import * as userLocalStorage from './authed-user.localstore'
import { AuthedUser } from './useAuthedUser'
import { useToast } from '@/components/ui/use-toast'
import { UseMutateFunction, useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

async function signIn(email: string, password: string): Promise<AuthedUser> {
  // @ts-expect-error we expect a user type
  return apiPost('auth/sign-in', { email, password })
}

type IUseSignIn = UseMutateFunction<
  AuthedUser,
  unknown,
  {
    email: string
    password: string
  },
  unknown
>

export function useSignIn(): IUseSignIn {
  const navigate = useNavigate()
  const { toast } = useToast()

  const { mutate: signInMutation } = useMutation<
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
    onError: (error) => {
      userLocalStorage.removeAuthedUser()
      toast({
        title: 'Oops, an error occured',
        description: error instanceof ResponseError ? error.message : '',
      })
    },
  })

  return signInMutation
}
