import 'components/c-button'
import 'components/c-link'
import 'components/c-login-form'
import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators'
import s from 'litsass:./styles.scss'

@customElement('v-home')
export class Home extends LitElement {
  constructor() {
    super()
  }

  @property({ type: String })
  private text: string = 'button'

  static styles = [s]

  render() {
    return html`
      <p>Home page</p>

      <div>
        Login:
        <c-login-form></c-login-form>
      </div>

      <div>
        Button:
        <c-button text="A button"></c-button>
      </div>

      <c-link to="/about">go to about</c-link>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'v-home': Home
  }
}
