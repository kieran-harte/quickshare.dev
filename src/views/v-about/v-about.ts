import 'components/c-link'
import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators'

@customElement('v-about')
export class VAbout extends LitElement {
  constructor() {
    super()
  }

  render() {
    return html`
      v-about
      <c-link to="/">Go home</c-link>
    `
  }
}
