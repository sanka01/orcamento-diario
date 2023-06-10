import Tonic from '@socketsupply/tonic'
import './components'

new EventSource('/esbuild').addEventListener('change', () => location.reload()) // eslint-disable-line

function MyApp () {
  return this.html`
        <h1>Orçamento diário</h1>
        <show-budgets id=show-budgets>
        </show-budgets>
    `
}

Tonic.add(MyApp)
