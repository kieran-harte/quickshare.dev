import { ReactiveController, ReactiveControllerHost } from 'lit'
import { Socket } from 'socket.io-client'

export class WS implements ReactiveController {
  host: ReactiveControllerHost

  public socket: Socket
  sessionId: string | undefined

  constructor(host: ReactiveControllerHost, socket: Socket) {
    host.addController(this)
    this.host = host
    this.socket = socket

    socket.on('connect', () => {
      console.log('connected')
    })
  }

  hostConnected() {}

  hostDisconnected() {}

  createSession() {
    this.socket.emit('newSession', (response: { id: string }) => {
      this.sessionId = response.id
      this.host.requestUpdate()

      history.replaceState(null, '', '/code?id=' + this.sessionId)
    })
  }

  rehostSession(sessionId: string) {
    this.socket.emit(
      'rehostSession',
      { id: sessionId },
      (response: { id: string }) => {
        this.sessionId = response.id
        this.host.requestUpdate()
        console.log('rehost success', response.id)
      }
    )
  }
}
