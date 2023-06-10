import Tonic from '@socketsupply/tonic'
import { registerGenericHandlers } from './eventHandling'

const actions = {
  toggleOpen (_e, update) {
    update.open = !this.props.open
  },
  addBudget (e, update) {
    const value = e.target.form.value.value
    this.dispatch('budgetAdded', {
      id: (this.props.prefix || 'daily-budget-') + e.target.form.id.value.replace(/ /g, '-'),
      value
    })
    actions.toggleOpen.call(this, e, update)
  }
}
const actionsDontReRender = {
  inputChange (e) {
    this.querySelector('output').value = 'R$ ' + e.target.value
  }
}

export class AddBudget extends Tonic {
  constructor (...args) {
    super(...args)
    const target = this
    registerGenericHandlers({ target, actions }, 'click')
    registerGenericHandlers({ target, actions: actionsDontReRender, reRender: false }, 'input')
  }

  render () {
    return this.html`
            <button data-event=toggleOpen>${this.props.text || 'Adicionar novo orçamento'}</button>
            ${(this.props.open && this.renderDialog()) || ''}
        `
  }

  renderDialog () {
    return this.html`
      <dialog open>
        <form>
          ${this.props.dialogTitle || ''}
          <label> Nome:</label>
          <input name=id required>
          <label> Valor diário:</label>
          ${this.renderInput()}
          <div>
            <button type=submit data-event=addBudget>Registrar novo orçamento</button>
          </div>
        </form>
      </dialog>
    `
  }

  renderInput () {
    if ('max' in this.props) {
      return this.html`<input type=range name=value min=0 max=${this.props.max} value=0 data-event=inputChange>
    <output></output>`
    } else return this.html`<input name=value type=number min=0>`
  }
}

Tonic.add(AddBudget)
