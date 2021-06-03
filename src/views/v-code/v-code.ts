import 'components/c-button'
import 'components/c-editor'
import 'components/c-file-explorer'
import 'components/c-header'
import 'components/c-icon'
import 'components/c-link'
import menuIcon from 'icons/menu'
import { html, LitElement } from 'lit'
import { customElement, state } from 'lit/decorators'
import s from 'litsass:./v-code.scss'
import { Socket } from 'socket.io-client'
import { WS } from '../../scripts/socket'
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
  private _files: { handle: FileSystemFileHandle }[] = []

  @state()
  private _currentCode = ''

  constructor() {
    super()

    this._ws = new WS(this, this._socket)

    //TODO !window.params.sessionId
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
    if (!this._files.length) {
      return this._renderNoFiles()
    } else {
      return this._renderEditor()
    }
  }

  _renderNoFiles() {
    return html`
      <p>is host: ${this._ws.isHost}</p>

      <div id="container">
        <h1>Session Created</h1>
        <h2>
          URL:
          ${window.location.origin +
          window.location.pathname +
          '?id=' +
          this._ws.sessionId}
        </h2>
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
          .files=${this._files}
          @fileClicked=${this._viewFile}
        ></c-file-explorer>
        <c-editor
          @change=${this._contentChanged}
          .content=${this._currentCode}
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
        this._files.push({ handle: item })
      } else {
        // TODO traverse subfolders
      }
    }

    this.requestUpdate()
  }

  async _openFiles() {
    const [handle] = await window.showOpenFilePicker()

    this._files.push({
      handle,
    })

    this.requestUpdate()
  }

  async saveChanges(handle: FileSystemFileHandle) {
    const writable = await handle.createWritable()
    await writable.write('changed')
    await writable.close()
  }

  async _viewFile(e: CustomEvent) {
    const handle = e.detail.handle as FileSystemFileHandle
    const file = await handle.getFile()
    const content = await file.text()

    this._currentCode = content
  }

  _contentChanged(event: CustomEvent) {
    const newContent = event.detail.content

    console.log(newContent)
    this._socket.emit('contentChanged', newContent)
  }
}
