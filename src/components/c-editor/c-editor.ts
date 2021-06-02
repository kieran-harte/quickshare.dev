import CodeMirror from 'codemirror'
import { html, LitElement } from 'lit'
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

  @state()
  private _codeMirror

  @state()
  private _mergeView

  @state()
  private _observer: ResizeObserver

  constructor() {
    super()

    this._observer = new ResizeObserver(this._sizeChanged)

    // this._codeMirror = CodeMirror(
    //   document.querySelector('#code') as HTMLElement,
    //   {
    //     value: '',
    //     mode: 'javascript',
    //     lineNumbers: true,
    //     theme: 'panda-syntax',
    //   }
    // )
    this._mergeView = CodeMirror.MergeView(
      document.querySelector('#code') as HTMLElement,
      {
        value: '',
        orig: 'console.log("original")',
        highlightDifferences: true,
        // connect: 'align',
        mode: 'javascript',
        lineNumbers: true,
        // theme: 'panda-syntax',
      }
    )

    this._codeMirror = this._mergeView.editor()

    this._codeMirror.getWrapperElement().style.display = 'none'

    this._codeMirror.on('changes', this._valueChanged)
  }

  connectedCallback() {
    super.connectedCallback()

    this._observer.observe(this)
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
    const evnt = new CustomEvent('change', {
      detail: {
        content: instance.getValue(),
      },
      composed: true,
      bubbles: true,
    })

    this.dispatchEvent(evnt)
  }

  updated(_changedProperties) {
    this._codeMirror.getWrapperElement().style.display = 'block'
    this._codeMirror.setValue(this.content)
  }

  render() {
    return html``
  }
}
