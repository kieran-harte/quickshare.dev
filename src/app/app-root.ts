import Router from '@kieranharte/lit-router'
import { html, LitElement, TemplateResult } from 'lit'
import { customElement, property } from 'lit/decorators'
import s from 'litsass:./app-root.scss'
import routes from './routes'

@customElement('app-root')
export class AppRoot extends LitElement {
  private _router: Router

  @property({ type: Object })
  public viewContent: TemplateResult = html``

  static styles = [s]

  constructor() {
    super()

    this._router = new Router(this, routes, 'QuickShare', ' - QuickShare')

    this._router.previousContent = html`<h1>test</h1>`
  }

  connectedCallback() {
    super.connectedCallback()

    window.navigate(window.location.pathname + window.location.search, true)
  }

  render() {
    return html`${this.viewContent}`
  }
}
