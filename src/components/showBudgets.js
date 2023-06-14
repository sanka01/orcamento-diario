import Tonic from '@socketsupply/tonic'
import { registerGenericHandlers } from './eventHandling'
import { configureSaveAndLoadState } from './persistenceHandling'

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
    configureSaveAndLoadState(this, 'localStorage',
      {
        field: 'budgets',
        preprocess: budgets => Array.from(budgets.entries()),
        postprocess: budgets => new Map(budgets || undefined)
      }
    )
    this.load()
    const target = this
    registerGenericHandlers({ target, actions }, 'click')
    this.addEventListener('budgetAdded', this)
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
