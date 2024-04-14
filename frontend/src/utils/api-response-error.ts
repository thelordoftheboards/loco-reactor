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
