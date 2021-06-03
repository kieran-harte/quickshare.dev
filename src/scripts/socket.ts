import { ReactiveController, ReactiveControllerHost } from 'lit'
import { Socket } from 'socket.io-client'

export class WS implements ReactiveController {
  host: ReactiveControllerHost

  public socket: Socket
  sessionId: string | undefined

  public isHost: boolean = false

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
    this.socket.emit(
      'newSession',
      (response: { id: string; passcode: string }) => {
        this.sessionId = response.id
        this.host.requestUpdate()

        this.isHost = true

        localStorage.setItem(response.id, response.passcode)

        history.replaceState(null, '', '/code?id=' + this.sessionId)
      }
    )
  }

  joinSession(sessionId: string) {
    // Get passcode if set (they will have passcode if they created the session)
    const passcode = localStorage.getItem(sessionId)

    this.socket.emit(
      'joinSession',
      { id: sessionId, passcode },
      (response: { id: string; passcode: string }) => {
        // Check if session was found
        if (!response.id) {
          window.notif('Session not found')
          window.navigate('/')
          return
        }

        this.sessionId = response.id
        this.isHost = !!passcode
        this.host.requestUpdate()

        console.log('rehost success', response)
      }
    )
  }
}
