import 'components/c-button'
import { html, LitElement } from 'lit'
import { customElement, property, state } from 'lit/decorators'
import s from 'litsass:./c-file-picker.scss'
import { File } from 'scripts/types'

@customElement('c-file-picker')
export class CFilePicker extends LitElement {
  static styles = [s]

  @state()
  private _files: File[] = []

  @property({ type: Boolean, reflect: true })
  private hovering: boolean = false

  constructor() {
    super()
  }

  connectedCallback() {
    super.connectedCallback()

    this.addEventListener('dragover', (e) => {
      e.preventDefault()
    })

    this.addEventListener('dragenter', (e) => {
      this.hovering = true
    })

    this.addEventListener('dragleave', (e) => {
      this.hovering = false
    })

    this.addEventListener('dragleave', (e) => {
      console.log('grag')
      e.preventDefault()
    })

    this.addEventListener('drop', async (e) => {
      e.preventDefault()

      const batch: Promise<FileSystemHandle | null>[] = []

      // Get promises to files/folders
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        const element = e.dataTransfer.items[i]
        batch.push(element.getAsFileSystemHandle())
      }

      const items = await Promise.all(batch)

      // Only want files, not folders
      this._files = items
        .filter((item) => item?.kind === 'file')
        .map((file) => ({ handle: file, name: file?.name } as File))

      this._filesPicked()
    })
  }

  render() {
    return html` <h1>Drag and Drop files here</h1>
      <p>Or</p>
      <c-button type="primary" @click=${this._openFolder}>
        Open folder
      </c-button>
      <c-button type="primary" @click=${this._openFiles}>
        Open files
      </c-button>`
  }

  _filesPicked() {
    if (!this._files.length) {
      window.notif('No files selected', 'error')
      return
    }

    this.dispatchEvent(
      new CustomEvent('files-picked', {
        composed: true,
        detail: { files: this._files },
      })
    )
  }

  async _openFolder() {
    const handle = await window.showDirectoryPicker()

    for await (const item of handle.values()) {
      if (item.kind === 'file') {
        this._files.push({ handle: item, name: item.name })
      } else {
        // TODO traverse subfolders
      }
    }

    this._filesPicked()
  }

  async _openFiles() {
    const [handle] = await window.showOpenFilePicker()

    this._files.push({
      handle,
      name: handle.name,
    })

    this._filesPicked()
  }
}
