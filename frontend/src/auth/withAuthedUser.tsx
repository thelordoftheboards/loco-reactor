import { useAuthedUser } from './useAuthedUser'
import { FC } from 'react'
import { Navigate } from 'react-router-dom'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withAuthedUser = (Component: FC<any>) => (props: any) => {
  const authedUser = useAuthedUser()

  // Verify that the user is authed, and if not send them to the sign-in page
  if (!(authedUser && authedUser.user && authedUser.user.pid)) {
    return <Navigate to='/auth/sign-in' replace={true} />
  }

  // Verify that the authed user email is verified, and if not send them to the verification page.
  if (!authedUser.user.is_verified) {
    return <Navigate to='/auth/verify' replace={true} />
  }

  return <Component authedUser={authedUser} {...props} />
}
