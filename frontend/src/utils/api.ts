import { LOCAL_STORAGE_KEY_AUTHED_USER } from '../hooks/authed-user.localstore'
import { ResponseError } from './api-response-error'

const apiUrlBase = '/api/'

export async function apiPost(
  urlRelative: string,
  body: object
): Promise<object> {
  const headers: RequestInit['headers'] = {
    'Content-Type': 'application/json',
  }

  const user = localStorage.getItem(LOCAL_STORAGE_KEY_AUTHED_USER)
  if (user) {
    try {
      headers.authorization = 'Bearer ' + JSON.parse(user).token
    } catch (_) {
      // If the token retrieval fails for any reason, do not add authorization bearer.
      // The server will return an error if it does not like such a request.
    }
  }

  const response = await fetch(apiUrlBase + urlRelative, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  let value = null,
    json_error = false
  try {
    value = await response.json()
  } catch (err) {
    json_error = true
  }

  if (json_error) {
    throw new ResponseError(
      'The response from the server could not be read, please try again.',
      null
    )
  } else if (value && (value.error_id || value.error_message)) {
    throw new ResponseError(value.error_message ?? value.error_id, value)
  } else if (!response.ok) {
    throw new ResponseError(
      'Request to server failed with status ' +
        response.status +
        ', please try again.',
      null
    )
  } else if (response.status !== 200) {
    throw new ResponseError(
      'Request to server returned unacceptable status ' +
        response.status +
        ', please try again.',
      null
    )
  }

  return value
}
