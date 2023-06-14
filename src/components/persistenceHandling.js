const supportedStorageTypes = ['localStorage']

const saveMethods = {
  localStorage () {
    window.localStorage.setItem(this.id, JSON.stringify(this.state))
  }
}

const loadMethods = {
  localStorage () {
    this.state = JSON.parse(window.localStorage.getItem(this.id)) ?? {}
  }
}

function saveFactory (storageType, fieldsProcessing) {
  return function save () {
    fieldsProcessing.forEach(({ field, preprocess }) => preprocess && (this.state[field] = preprocess(this.state[field])))
    saveMethods[storageType].call(this)
    fieldsProcessing.forEach(({ field, postprocess }) => postprocess && (this.state[field] = postprocess(this.state[field])))
  }
}

function loadFactory (storageType, fieldsProcessing) {
  return function load () {
    loadMethods[storageType].call(this)
    fieldsProcessing.forEach(({ field, postprocess }) => postprocess && (this.state[field] = postprocess(this.state[field])))
  }
}

/**
 *
 * @param {Tonic} target
 * @param {'localStorage'} storageType
 * @param  {...{ field: string, preprocess: any => any, postprocess: any => any }} fieldsProcessing
 */
export function configureSaveAndLoadState (target, storageType, ...fieldsProcessing) {
  if (!supportedStorageTypes.includes(storageType)) throw new Error('Unsupported storage type')
  target.save = saveFactory(storageType, fieldsProcessing).bind(target)
  target.load = loadFactory(storageType, fieldsProcessing).bind(target)
}
