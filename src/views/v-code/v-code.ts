import 'components/c-button'
import 'components/c-file-explorer'
import 'components/c-header'
import 'components/c-icon'
import 'components/c-link'
import menuIcon from 'icons/menu'
import { html, LitElement } from 'lit'
import { customElement, state } from 'lit/decorators'
import s from 'litsass:./v-code.scss'
import { Socket } from 'socket.io-client'
const io = require('socket.io-client')

@customElement('v-code')
export class VCode extends LitElement {
  @state()
  private _socket: Socket = io()

  constructor() {
    super()

    this._socket = this._socket.on('connect', () => {
      console.log('connected')
    })
  }

  static styles = [s]

  @state()
  private _menuOpen = false

  @state()
  private _loading = false

  @state()
  private _files: { handle: FileSystemFileHandle }[] = []

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

      <div id="container">
        ${this._loading ? this.renderLoading() : this._renderContainer()}
      </div>
    `
  }

  _renderContainer() {
    console.log(this._files.length)
    if (!this._files.length) {
      return this._renderNoFiles()
    } else {
      return this._renderFilesChosen()
    }
  }

  _renderNoFiles() {
    return html`
      <h1>Session Created</h1>
      <h2>URL:</h2>
      <c-button type="primary" @click=${this._openFolder}>
        Open folder
      </c-button>
      <p>Or</p>
      <c-button type="primary" @click=${this._openFiles}> Open files </c-button>
    `
  }

  _renderFilesChosen() {
    return html` <c-file-explorer .files=${this._files}></c-file-explorer> `
  }

  renderLoading() {
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

    // const file = await handle.getFile()
    // const content = await file.text()
    this.requestUpdate()
  }

  async saveChanges(handle: FileSystemFileHandle) {
    const writable = await handle.createWritable()
    await writable.write('changed')
    await writable.close()
  }
}
