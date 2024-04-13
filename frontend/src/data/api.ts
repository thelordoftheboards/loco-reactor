import { ResponseError } from '../utils/Errors/ResponseError'

const apiUrlBase = '/api/'

export async function apiPost(
  urlRelative: string,
  body: object
): Promise<object> {
  const response = await fetch(apiUrlBase + urlRelative, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
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
    throw new ResponseError('The response could not be read', response)
  } else if (value && value.error_id) {
    throw new ResponseError(value.error_id, response)
  } else if (!response.ok) {
    throw new ResponseError('Request to server failed', response)
  } else if (response.status !== 200) {
    throw new ResponseError(
      'Request to server returned unacceptable status ' + response.status,
      response
    )
  }

  return value
}
