import 'components/c-button'
import 'components/c-header'
import 'components/c-link'
import 'components/c-login-form'
import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators'
import s from 'litsass:./v-home.scss'

@customElement('v-home')
export class Home extends LitElement {
  constructor() {
    super()
  }

  static styles = [s]

  render() {
    return html`
      <c-header><p slot="left">QickShare.dev</p> </c-header>

      <div id="container">
        <h1 id="title">Instant Real-Time Code Sharing</h1>

        <div id="actions">
          <c-button type="action">Join Session</c-button>
          <c-link to="/code">
            <c-button type="action">+ New Session</c-button>
          </c-link>
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'v-home': Home
  }
}
