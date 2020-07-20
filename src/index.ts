import { Socket, SocketConnectOption } from 'phoenix'

type SockParamsPromise = () => Promise<Record<string, unknown>>
type SocketParams = Promise<Record<string, unknown>> | (() => Promise<Record<string, unknown>>) | SockParamsPromise

/**
 * phoenix package does not support async params, so we need to create a intermediary socket class to handle
 * NOTE: it will show "passing params to connect is deprecated" message when connecting,
 * but one of package authors suggested this approach.
 * @see https://github.com/phoenixframework/phoenix/issues/3515#issuecomment-628192821
 */
export default class AsyncParamsPhoenixSocket extends Socket {
  params: SocketParams

  constructor(endPoint: string, opts: Partial<SocketConnectOption> = {}) {
    super(endPoint, opts)

    this.params = opts.params as SocketParams || {}
  }

  connect(_params: SocketParams): void {
    if (
      this.params?.constructor == Function &&
      (this.params as SockParamsPromise)()?.constructor === Promise
    ) {
      // createa a promise resolver to deal with params, then call parent connect method
      Promise.resolve((this.params as SockParamsPromise)()).then((params) =>
      // this will show in console "passing params to connect is deprecated" message
        super.connect(params)
      )
    } else {
      super.connect() // we don't need to send params because it already sent when calling parent constructor
    }
  }
}
