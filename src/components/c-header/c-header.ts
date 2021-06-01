import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators'
import s from 'litsass:./c-header.scss'

@customElement('c-header')
export class CHeader extends LitElement {
  static styles = [s]

  constructor() {
    super()
  }

  render() {
    return html`<div id="shadow"></div>
      <div id="header">
        <slot name="left"></slot>
        <slot name="center"></slot>
        <slot name="right"></slot>
      </div> `
  }
}
