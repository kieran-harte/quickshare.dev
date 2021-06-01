import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators'
import s from 'litsass:./c-button.scss'

@customElement('c-button')
export class Button extends LitElement {
  constructor() {
    super()
  }

  static styles = [s]

  render() {
    return html` <slot></slot> `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'c-button': Button
  }
}
