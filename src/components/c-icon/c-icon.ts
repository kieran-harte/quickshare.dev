import { css, html, LitElement } from 'lit'
import { customElement } from 'lit/decorators'

@customElement('c-icon')
export class CIcon extends LitElement {
  static styles = [
    css`
      :host {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `,
  ]

  constructor() {
    super()
  }

  render() {
    return html`<slot></slot>`
  }
}
