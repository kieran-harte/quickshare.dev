import { html, LitElement } from 'lit'
import { customElement, property, state } from 'lit/decorators'
import s from 'litsass:./c-file-explorer.scss'

@customElement('c-file-explorer')
export class CFileExplorer extends LitElement {
  static styles = [s]

  @property({ type: Array })
  public files: { handle: FileSystemFileHandle }[] = []

  @state()
  private _activeFile = this.files[0]

  constructor() {
    super()
  }

  render() {
    return html`${this.files.map(
      (item) =>
        html`<div
          class="file"
          ?active=${item === this._activeFile}
          @click=${() => {
            this._fileClicked(item)
          }}
        >
          ${item.handle.name}
        </div> `
    )}`
  }

  _fileClicked(item: { handle: FileSystemFileHandle }) {
    const evnt = new CustomEvent('fileClicked', {
      detail: { handle: item.handle },
      composed: true,
      bubbles: true,
    })

    this.dispatchEvent(evnt)

    this._activeFile = item
  }
}
