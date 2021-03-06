import CodeMirror from 'codemirror'
import 'components/c-button'
import { html, LitElement, PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators'
import s from 'litsass:./c-editor.scss'
import 'node_modules/codemirror'
import 'node_modules/codemirror/addon/merge/merge.js'
import 'node_modules/codemirror/mode/javascript/javascript.js'
import 'node_modules/codemirror/mode/sass/sass.js'
import 'node_modules/codemirror/mode/xml/xml.js'

@customElement('c-editor')
export class CEditor extends LitElement {
  static styles = [s]

  @property({ type: String })
  public content: string = ''

  @property({ type: String })
  public guestContent: string = ''

  @property({ type: Boolean })
  public isHost: boolean = false

  @state()
  private _codeMirror

  @state()
  private _mergeView

  @state()
  private _observer: ResizeObserver

  // Keeping track so can see if changed since last save
  @state()
  private _currentContent = ''
  @state()
  private _lastSavedContent: string | undefined

  constructor() {
    super()

    this._observer = new ResizeObserver(this._sizeChanged)

    this._mergeView = CodeMirror.MergeView(
      document.querySelector('#code') as HTMLElement,
      {
        value: '',
        orig: 'orig',
        highlightDifferences: true,
        // connect: 'align',
        mode: 'javascript',
        lineNumbers: true,
        lineWrapping: true,
        // theme: 'panda-syntax',
      }
    )

    this._codeMirror = this._mergeView.editor()

    this._codeMirror.getWrapperElement().style.display = 'none'

    this._codeMirror.on('changes', this._valueChanged)
  }

  connectedCallback() {
    super.connectedCallback()
  }

  firstUpdated(_changedProperties) {
    const placeholder = this.shadowRoot!.querySelector('#editorPlaceholder')!
    if (placeholder) {
      this._observer.observe(placeholder)
    } else {
      window.notif('Problem loading editor', 'error')
    }
  }

  _sizeChanged = (entries: ResizeObserverEntry[]) => {
    const e = entries[0]
    const newBounds = e.target.getBoundingClientRect()

    const codeMirrorDiv = document.querySelector('#code') as HTMLDivElement
    codeMirrorDiv.style.width = newBounds.width + 'px'
    codeMirrorDiv.style.height = newBounds.height + 'px'
    codeMirrorDiv.style.left = newBounds.left + 'px'
    codeMirrorDiv.style.top = newBounds.top + 'px'

    this._codeMirror.setSize(newBounds.width, newBounds.height)

    this._mergeView.rightOriginal().setSize(newBounds.width, newBounds.height)

    this._mergeView.wrap.style.height = newBounds.height + 'px'
  }

  _valueChanged = (instance: CodeMirror.Editor, changeObj: object) => {
    // Fire event containing new editor content whenever it changes
    const content = instance.getValue()
    const evnt = new CustomEvent('change', {
      detail: {
        content,
      },
      composed: true,
      bubbles: true,
    })

    this.dispatchEvent(evnt)

    // Keep track of current value
    this._currentContent = content
    if (this._lastSavedContent === undefined) this._lastSavedContent = content
  }

  updated(_changedProperties: PropertyValues) {
    this._codeMirror.getWrapperElement().style.display = 'block'

    if (_changedProperties.has('content')) {
      if (this.isHost) {
        this._codeMirror.setValue(this.content)
      } else {
        this._mergeView.rightOriginal().setValue(this.content)
      }
    }

    if (_changedProperties.has('guestContent')) {
      if (this.isHost) {
        this._mergeView.rightOriginal().setValue(this.guestContent)
      } else {
        this._codeMirror.setValue(this.guestContent)
      }
    }
  }

  _save() {
    this.dispatchEvent(
      new CustomEvent('save', {
        composed: true,
      })
    )

    this._lastSavedContent = this._currentContent
  }

  render() {
    return html`
      <div id="headers">
        <div id="left">
          <p>Me</p>
          ${this.isHost
            ? html`
                <c-button
                  type="primary"
                  @click=${this._save}
                  ?disabled=${this._lastSavedContent === this._currentContent}
                  >Save</c-button
                >
              `
            : ''}
        </div>
        <div id="right"><p>${this.isHost ? 'Guest' : 'Host'}</p></div>
      </div>
      <div id="editorPlaceholder"></div>
    `
  }
}
