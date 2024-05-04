import { LOCAL_STORAGE_KEY_AUTHED_USER } from '../hooks/authed-user.localstore'

const apiUrlBase = '/api/'

//

export class ResponseError extends Error {
  constructor(
    message: string,
    public response_value: any
  ) {
    super(message)

    this.response_value = response_value

    console.error('ResponseError created: ', message, response_value)
  }
}

//

export async function apiGet(
  urlRelative: string,
  params?: Record<string, any>
): Promise<unknown> {
  try {
    const headers = createHeaders()

    const urlSearchParams = params
      ? '?' + new URLSearchParams(params).toString()
      : ''

    const response = await fetch(apiUrlBase + urlRelative + urlSearchParams, {
      method: 'GET',
      headers,
    })

    return await processResponse(response)
  } catch (err) {
    throw new ResponseError(
      'Request to server failed with exception: ' +
        (err instanceof Error ? err.message : 'unknown') +
        ', please try again.',
      null
    )
  }
}

export async function apiCall(
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  urlRelative: string,
  body: object
): Promise<object> {
  try {
    const headers = createHeaders()

    const response = await fetch(apiUrlBase + urlRelative, {
      method,
      headers,
      body: JSON.stringify(body),
    })

    return await processResponse(response)
  } catch (err) {
    throw new ResponseError(
      'Request to server failed with exception: ' +
        (err instanceof Error ? err.message : 'unknown') +
        ', please try again.',
      null
    )
  }
}

function createHeaders(): RequestInit['headers'] {
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

  return headers
}

async function processResponse(response: Response): Promise<object> {
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
