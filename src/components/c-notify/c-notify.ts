import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators'
import s from 'litsass:./c-notify.scss'

type NotifType = 'success' | 'warn' | 'error' | 'info'

@customElement('c-notify')
export class CNotify extends LitElement {
  static styles = [s]

  @property({ type: Boolean, reflect: true })
  visible: boolean = false

  @property({ type: String, reflect: true })
  type: NotifType = 'info'

  @property({ type: String, reflect: true })
  message: string = ''

  timeout: NodeJS.Timeout | undefined

  constructor() {
    super()
  }

  render() {
    return html`${this.message}`
  }

  show(msg: string, type?: NotifType) {
    this.message = msg
    this.type = type || 'info'

    this.visible = true
    if (this.timeout) clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.visible = false
    }, 2500)
  }
}
