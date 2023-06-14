import Tonic from '@socketsupply/tonic'
import b4a from 'b4a'

export class SharedBudget extends Tonic {
  render () {
    return this.html`
            <daily-budget id='budget-of-${this.id}' value=50></daily-budget>
        `
  }
}

Tonic.add(SharedBudget)

function createHash (topic) {
  return window.crypto.subtle.digest('SHA-256', b4a.from(topic)).then(b4a.from)
}
