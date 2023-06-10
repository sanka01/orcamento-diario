import Tonic from '@socketsupply/tonic'
import { registerGenericHandlers } from './eventHandling'

const actions = {
  newDaw () {
    this.querySelectorAll('daily-budget')
      .forEach(budget => budget.resetValue())
  },
  saveBudgets () {
    this.save()
    this.querySelectorAll('daily-budget').forEach(dailyBudget => dailyBudget.save())
  }
}

export class ShowBudgets extends Tonic {
  constructor (...args) {
    super(...args)
    this.state = JSON.parse(window.localStorage.getItem(this.id)) ?? {}
    this.state.budgets = new Map(this.state.budgets || undefined)
    const target = this
    registerGenericHandlers({ target, actions }, 'click')
    this.addEventListener('budgetAdded', this)
  }

  save () {
    this.state.budgets = Array.from(this.state.budgets.entries())
    window.localStorage.setItem(this.id, JSON.stringify(this.state))
    this.state.budgets = new Map(this.state.budgets)
  }

  budgetAdded ({ detail: budget }) {
    this.state.budgets.set(budget.id, budget)
    this.reRender()
  }

  render () {
    this.save()
    return this.html`
        <button data-event=newDaw>Novo dia</button>
        <button data-event=saveBudgets>Salvar</button>
        <nav>${Array.from(this.state.budgets.values())
          .map(budget => this.html`<daily-budget ...${budget}></daily-budget>`)
        }</nav>
        <add-budget></add-budget>
    `
  }
}

Tonic.add(ShowBudgets)
