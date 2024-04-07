import { useAuthedUser } from './useAuthedUser'
import { FC } from 'react'
import { Navigate } from 'react-router-dom'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withAuthedUser = (Component: FC<any>) => (props: any) => {
  const authedUser = useAuthedUser()

  if (!(authedUser && authedUser.user && authedUser.user.pid)) {
    return <Navigate to='/sign-in' replace={true} />
  }

  // TODO Verify that the authed user is validated, and if not send them to a validation/verify page.

  return <Component authedUser={authedUser} {...props} />
}
