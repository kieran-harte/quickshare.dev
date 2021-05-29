import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators'

@customElement('c-link')
export class CLink extends LitElement {
  @property({ type: String })
  public to: string = ''

  static styles = [
    css`
      div {
        text-decoration: underline;
        cursor: pointer;
        color: blue;
      }
      div:hover {
        color: steelblue;
      }
    `,
  ]

  onClick() {
    if (this.to !== undefined && this.to !== null) {
      window.navigate(this.to)
    }
  }

  render() {
    return html`<div @click=${this.onClick}>
      <slot></slot>
    </div>`
  }
}
