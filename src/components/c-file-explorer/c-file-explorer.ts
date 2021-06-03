import { html, LitElement } from 'lit'
import { customElement, property, state } from 'lit/decorators'
import s from 'litsass:./c-file-explorer.scss'
import { File } from 'scripts/types'

@customElement('c-file-explorer')
export class CFileExplorer extends LitElement {
  static styles = [s]

  @property({ type: Array })
  public files: File[] = []

  @state()
  private _activeFile = this.files[0]

  constructor() {
    super()
  }

  firstUpdated(_changedProperties) {
    this._fileClicked(this.files[0])
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
          ${item.name}
        </div> `
    )}`
  }

  _fileClicked(item: File) {
    const evnt = new CustomEvent('fileClicked', {
      detail: { name: item.name },
      composed: true,
      bubbles: true,
    })

    this.dispatchEvent(evnt)

    this._activeFile = item
  }
}
