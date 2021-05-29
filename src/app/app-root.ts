import { html, LitElement, TemplateResult } from 'lit'
import Router from 'lit-router'
import { customElement, property } from 'lit/decorators'
import routes from './routes'

@customElement('app-root')
export class AppRoot extends LitElement {
  private _router: Router

  @property({ type: Object })
  public viewContent: TemplateResult = html``

  constructor() {
    super()

    this._router = new Router(this, routes, 'Lit Studio', ' - Lit Studio')

    this._router.previousContent = html`<h1>test</h1>`
  }

  connectedCallback() {
    super.connectedCallback()

    window.navigate(window.location.pathname + window.location.search, true)
  }

  render() {
    return html`<div>${this.viewContent}</div>`
  }
}
