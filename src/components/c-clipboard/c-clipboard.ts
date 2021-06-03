import { html, LitElement } from 'lit'
import { customElement, property, state } from 'lit/decorators'
import s from 'litsass:./c-clipboard.scss'

@customElement('c-clipboard')
export class CClipboard extends LitElement {
  static styles = [s]

  @property({ type: String })
  public content: string | undefined

  @property({ type: String, reflect: true })
  public type: 'full' | 'button' = 'full'

  @property({ type: Object })
  public labels: { normal: string; copied: string } = {
    normal: 'Copy',
    copied: 'Copied!',
  }

  @state()
  private _copied = false

  timeout: NodeJS.Timeout | undefined

  constructor() {
    super()
  }

  render() {
    return html`
      ${this.type === 'full'
        ? html`
            <div id="content" ?copied=${this._copied}>${this.content}</div>
          `
        : ''}
      <c-button type="primary" @click=${this._onClick} ?copied=${this._copied}
        >${this._copied ? this.labels.copied : this.labels.normal}</c-button
      >
    `
  }

  _onClick() {
    // copy to clipboard
    if (!this.content) {
      return window.notif('Could not copy', 'error')
    }
    navigator.clipboard.writeText(this.content)
    window.notif('Copied', 'success')
    this._copied = true

    // Revert back to 'Copy' state after 2 seconds
    if (this.timeout) clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this._copied = false
    }, 1500)
  }
}
