import {html, LitElement} from 'lit'
import {customElement, state, property} from 'lit/decorators'

@customElement('my-comp')
export class MyComp extends LitElement {
  constructor() {
    super()
  }

  @state()
  private _name: string = 'kieran'

  increment() {
    this._name = 'test'
  }

  render() {
    return html`
      <p>my comp: ${this._name}</p>
      <button @click=${this.increment}>inc</button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-comp': MyComp
  }
}
