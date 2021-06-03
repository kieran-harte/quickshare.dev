import 'components/c-button'
import 'components/c-clipboard'
import 'components/c-editor'
import 'components/c-file-explorer'
import 'components/c-header'
import 'components/c-icon'
import 'components/c-link'
import menuIcon from 'icons/menu'
import { html, LitElement } from 'lit'
import { customElement, state } from 'lit/decorators'
import s from 'litsass:./v-code.scss'
import { WS } from 'scripts/socket'
import { File } from 'scripts/types'
import { Socket } from 'socket.io-client'
const io = require('socket.io-client')

@customElement('v-code')
export class VCode extends LitElement {
  static styles = [s]

  @state()
  private _socket: Socket = io()

  @state()
  private _ws: WS

  @state()
  private _menuOpen = false

  @state()
  private _loading = true

  @state()
  private files: File[] = []

  @state()
  private _currentContent = ''

  @state()
  private _guestContent = ''

  @state()
  private _currentFileName = ''

  constructor() {
    super()

    this._ws = new WS(this, this._socket)

    // Create a new session
    if (!window.params.id) {
      this._ws.createSession()
    } else {
      this._ws.joinSession(window.params.id)
    }
  }

  render() {
    return html`
      <c-header>
        <div slot="left">
          <div
            @click=${() => {
              this._menuOpen = !this._menuOpen
            }}
          >
            <c-icon id="menu-icon">${menuIcon}</c-icon>
          </div>
        </div>
      </c-header>

      ${!this._ws.sessionId ? this.renderLoading() : this._renderSession()}
    `
  }

  _renderSession() {
    if (!this.files.length) {
      return this._renderNoFiles()
    } else {
      return this._renderEditor()
    }
  }

  _renderNoFiles() {
    if (!this._ws.isHost) {
      return html` <div id="container">
        <h1>Joined as guest</h1>
        <h2>Waiting for host to open a file</h2>
      </div>`
    }

    return html`
      <p>is host: ${this._ws.isHost}</p>

      <div id="container">
        <h1>Session Created</h1>
        <h2>Invite a guest to review your code:</h2>
        <c-clipboard
          .content=${window.location.origin +
          window.location.pathname +
          '?id=' +
          this._ws.sessionId}
        ></c-clipboard>
        <c-button type="primary" @click=${this._openFolder}>
          Open folder
        </c-button>
        <p>Or</p>
        <c-button type="primary" @click=${this._openFiles}>
          Open files
        </c-button>
      </div>
    `
  }

  _renderEditor() {
    return html`
      <p>is host: ${this._ws.isHost}</p>

      <div id="editorContainer">
        <c-file-explorer
          .files=${this.files}
          @fileClicked=${this._viewFile}
        ></c-file-explorer>
        <c-editor
          @change=${this._contentChanged}
          .content=${this._currentContent}
          .guestContent=${this._guestContent}
          .isHost=${this._ws.isHost}
        ></c-editor>
      </div>
    `
  }

  renderLoading() {
    if (window.params.id) {
      return html`<h1>Loading session...</h1>`
    }
    return html`<h1>Creating session...</h1>`
  }

  async _openFolder() {
    const handle = await window.showDirectoryPicker()

    for await (const item of handle.values()) {
      if (item.kind === 'file') {
        this.files.push({ handle: item, name: item.name })
      } else {
        // TODO traverse subfolders
      }
    }

    // Send newly opened files to server
    this._ws.filesOpened(this.files)

    this.requestUpdate()
  }

  async _openFiles() {
    const [handle] = await window.showOpenFilePicker()

    this.files.push({
      handle,
      name: handle.name,
    })

    // Send newly opened files to server
    this._ws.filesOpened(this.files)

    this.requestUpdate()
  }

  async saveChanges(handle: FileSystemFileHandle) {
    const writable = await handle.createWritable()
    await writable.write('changed')
    await writable.close()
  }

  async _viewFile(e: CustomEvent) {
    const name = e.detail.name as string

    // read from file if haven't already & is host
    let content, guestContent
    const file = this._getFile(name)
    const handle = file?.handle
    if (!file?.content && handle) {
      const file = await handle.getFile()
      content = await file.text()
      // guestContent = content
    } else {
      content = file?.content || ''
      guestContent = file?.guestContent || ''
    }

    this._currentFileName = name
    this._currentContent = content
    this._guestContent = guestContent || ''
  }

  // called when codemirror content changes
  _contentChanged(event: CustomEvent) {
    const { content } = event.detail

    // Update files property with new content
    this.files.forEach((file) => {
      if (file.name === this._currentFileName) {
        if (this._ws.isHost) {
          file.content = content
        } else {
          file.guestContent = content
        }
      }
    })

    // Emit update to other person
    this._ws.updateFile(this._currentFileName, content)
  }

  _getFile(name: string) {
    const f = this.files.find((file: File) => file.name === name)
    return f
  }

  // updates the other persons code in the editor
  updateRemoteEditor() {
    if (this._ws.isHost) {
      // Update guests editor
      this._guestContent =
        this._getFile(this._currentFileName)?.guestContent || ''
    } else {
      this._currentContent = this._getFile(this._currentFileName)?.content || ''
    }
  }
}
