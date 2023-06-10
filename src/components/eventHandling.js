import Tonic from '@socketsupply/tonic'
/**
 * @typedef {Object<string, (event: Event, update: Object) => any>} ActionHandlerObject
 */

/**
 * @param {ActionHandlerObject} actions
 * @param {{ isForgiving: bool, reRender: bool, stopPropagation: bool, preventDefault: bool }?} options
 * Receives an object with keys that are the name of the action
 * (the same that you will put on the data-event property on the element)
 */
export function genericEventHandler (actions, { isForgiving = false, reRender = true, stopPropagation = true, preventDefault = true } = {}) {
  return function (e) {
    const update = {}
    const el = Tonic.match(e.target, '[data-event]')
    if (!el) return
    const actionName = el.dataset.event
    const action = actions[actionName]
    if (!action || typeof action !== 'function') {
      if (isForgiving) throw new Error('invalid action invoked')
      else return
    }

    if (preventDefault) e.preventDefault()
    if (stopPropagation) e.stopPropagation()
    action.call(this, e, update)
    if (reRender) this.reRender(o => ({ ...o, ...update }))
  }
}

/**
 * @param {{
 *  target: Tonic,
 *  actions: ActionHandlerObject,
 *  isForgiving: bool = false,
 *  reRender: bool = true,
 *  stopPropagation: bool = true,
 *  preventDefault: bool = true,
 * }} options
 * @param {Tonic} options.target the component that will have the listeners registered to
 * @param options.actions an object that have the data-event field as keys, paired with the event handler
 * @param  {...string} events
 */
export function registerGenericHandlers ({ target, actions, ...opts }, ...events) {
  const handler = genericEventHandler(actions, opts).bind(target)
  events.forEach(event => {
    target[event] = handler
    target.addEventListener(event, target)
  })
}
