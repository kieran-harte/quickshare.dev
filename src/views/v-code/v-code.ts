import 'components/c-button'
import 'components/c-header'
import 'components/c-icon'
import 'components/c-link'
import menuIcon from 'icons/menu'
import { html, LitElement } from 'lit'
import { customElement, state } from 'lit/decorators'
import s from 'litsass:./v-code.scss'

@customElement('v-code')
export class VCode extends LitElement {
  constructor() {
    super()
  }

  static styles = [s]

  @state()
  private _menuOpen = false

  @state()
  private _loading = false

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
        ${this._loading ? this.renderLoading() : this._render()}
      </div>
    `
  }

  _render() {
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

  renderLoading() {
    return html`<h1>Creating session...</h1>`
  }

  _openFolder() {}

  _openFiles() {}
}
