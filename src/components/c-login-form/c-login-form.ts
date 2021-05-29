import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators'
import '../c-button'

@customElement('c-login-form')
export class LoginForm extends LitElement {
	constructor() {
		super()
	}

	@property({ type: String })
	private text: string = 'button'

	render() {
		return html`
			<form action="">
				<input type="text" name="name" id="name" placeholder="Name">
				<c-button text="Login"></c-button>
			</form>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"c-login-form": LoginForm
	}
}