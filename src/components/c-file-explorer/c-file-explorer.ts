import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators'
import s from 'litsass:./c-file-explorer.scss'

@customElement('c-file-explorer')
export class CFileExplorer extends LitElement {
  static styles = [s]

  @property({ type: Array })
  public files: { handle: FileSystemFileHandle }[] = []

  constructor() {
    super()
  }

  render() {
    return html`${this.files.map((item) => html`${item.handle.name}`)}`
  }
}
