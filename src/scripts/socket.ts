import { ReactiveController, ReactiveControllerHost } from 'lit'
import { File } from 'scripts/types'
import { Socket } from 'socket.io-client'

interface RCHostWithFiles extends ReactiveControllerHost {
  files: File[]
  updateRemoteEditor: () => void
}

export class WS implements ReactiveController {
  host: RCHostWithFiles

  public socket: Socket
  sessionId: string | undefined

  public isHost: boolean = false

  constructor(host: RCHostWithFiles, socket: Socket) {
    host.addController(this)
    this.host = host
    this.socket = socket

    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on('fileChanged', this._onFileChanged)

    socket.on('initFiles', this._onInitFiles)
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
      }
    )
  }

  _onInitFiles = (files: File[]) => {
    this.host.files = files
  }

  // New files opened from host's computer
  async filesOpened(files: File[]) {
    // Get content of each file
    const filesWithContent = []
    for await (const file of files) {
      const content = await (await file.handle.getFile()).text()
      filesWithContent.push({
        name: file.handle.name,
        content,
        guestContent: content,
      })
    }

    this.socket.emit('filesOpened', filesWithContent)
  }

  updateFile(name: string, content: string) {
    this.socket.emit('updateFile', { name, content })
  }

  _onFileChanged = (data) => {
    const { name, content, guestContent } = data
    this.host.files.forEach((file) => {
      if (file.name === name) {
        file.guestContent = guestContent
        file.content = content

        this.host.updateRemoteEditor()
      }
    })
  }
}
