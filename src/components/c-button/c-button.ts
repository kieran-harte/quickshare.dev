import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators'

@customElement('c-button')
export class Button extends LitElement {
	constructor() {
		super()
	}

	@property({ type: String })
	private text: string = 'button'

	render() {
		return html`
			<button>${this.text}</button>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"c-button": Button
	}
}