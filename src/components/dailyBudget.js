import Tonic from '@socketsupply/tonic'
import { registerGenericHandlers } from './eventHandling'
import { configureSaveAndLoadState } from './persistenceHandling'

const actions = {
  openAddExpense (_e, update) {
    update.expenseDialogOpen = !this.props.expenseDialogOpen
    update.subDialogOpen = false
  },
  addExpense (e, update) {
    console.log('adding expense on', this.id)
    const valueUpdate = e.target.form.elements.value.value || 0
    this.dispatch('budgetUpdated', parseInt(valueUpdate))
    update.expenseDialogOpen = false
  },
  deleteSelf () {
    this._deleteSelf()
  }
}

export class DailyBudget extends Tonic {
  constructor (...args) {
    super(...args)
    configureSaveAndLoadState(this, 'localStorage',
      {
        field: 'subs',
        preprocess: subs => Array.from(subs.entries()),
        postprocess: subs => new Map(subs || undefined)
      }
    )
    this.load()
    console.log(this.state)
    const target = this
    registerGenericHandlers({ target, actions }, 'click')
    this.addEventListener('budgetDeleted', this)
    this.addEventListener('budgetUpdated', this)
    this.addEventListener('budgetAdded', this)
  }

  willConnect () {
    console.log(this.state, this.props)
    this.state.current ??= parseInt(this.props.value)
  }

  budgetAdded (e) {
    e.stopPropagation()
    const { detail: budget } = e
    this.state.subs.set(budget.id, budget)
    this.reRender()
  }

  budgetDeleted (e) {
    const sub = e.target
    if (sub === this) return
    this.state.current += (sub.props.value - sub.state.current)
    this.state.subs.delete(sub.id)
    this.reRender()
  }

  budgetUpdated ({ detail: update }) {
    console.log('updating', this.id)
    this.state.current -= update
    this.reRender()
  }

  _deleteSelf () {
    this.querySelectorAll('daily-budget').forEach(budget => {
      console.log(budget)
      budget._deleteSelf()
    })
    this.dispatch('budgetDeleted')
    console.log('deleting localstorage key', this.id)
    window.localStorage.removeItem(this.id)
    delete Tonic._states[this.id]
    this.remove()
  }

  disconnected () {
    this.save()
  }

  isSub () {
    return 'isSub' in this.props
  }

  resetValue () {
    this.state.current = parseInt(this.props.value)
    this.reRender()
  }

  render () {
    this.save()
    return this.html` 
      <details open>
        <summary>
          ${this.renderName()}
        </summary>
        <div>
          ${this.renderCurrentValue()}
          ${this.renderCurrentExpense()}
        </div>
        <ul>
          ${Array.from(this.state.subs.values()).map(sub => this.html`<daily-budget is-sub ...${sub}></daily-budget>`)}
        </ul>
        ${this.renderRegisterExpense()}
        ${(this.props.expenseDialogOpen && this.renderExpenseDialog()) || ''}
        <add-budget 
          prefix='${this.id + '-'}' 
          max=${this.props.value} 
          text="Adicionar sub orçamento" 
          dialog-title="Sub para ${this.renderName()}">
        </add-budget>
        ${this.renderDeleteSelf()}
      </details>
    `
  }

  renderCurrentValue () {
    const value = this.state.current || 0
    return this.html`
      <div>
        <p>
          Orçamento restante: R$ ${value.toString()}
        </p>
      </div>
    `
  }

  renderCurrentExpense () {
    const max = this.props.value
    const value = this.state.current
    const diff = max - value
    return this.html`
      <meter ...${{ max, value: diff }}>
      </meter>
      R$ ${diff.toString()}
      (${(100 * diff / max).toFixed(0)}%) gastos hoje
    `
  }

  renderRegisterExpense () {
    return this.html`
      <button data-event=openAddExpense>
        Adicionar gasto
      </button>
    `
  }

  renderDeleteSelf () {
    return this.html`
      <button data-event=deleteSelf>
        Deletar orçamento
      </button>
    `
  }

  renderExpenseDialog () {
    return this.html`
      <dialog open>
        <form>
          <label> Valor do gasto (${this.renderName()}): </label>
          <input name=value type=number min=0>
          <div>
            <button type=submit data-event=addExpense>Registrar</button>
          </div>
        </form>
      </dialog>
    `
  }

  renderName () {
    let name = this.id
    if (name.startsWith('daily-budget-')) {
      name = name.split('daily-budget-', 2)[1]
    }
    name = name
      .split('-')
      .map(name => [name[0].toUpperCase(), ...name.substring(1)].join(''))
      .join(' ')
    return name
  }
}

Tonic.add(DailyBudget)
