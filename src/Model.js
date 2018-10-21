
export default class Model {
  static spec = undefined
  __attrs = null


  constructor(attrs) {
    if (attrs) {
      this.spec = attrs
    } else {
      this.spec = this.constructor.attrs
    }
    this.init()
  }

  init() {
    this.__attrs = {}

    for (let [key, val] of Object.entries(this.spec)) {
      Object.defineProperty(this, key, {
        set: val => {
          this.__attrs[key] = val

          // trigger change event
          if (this.onChange !== undefined) {
            this.onChange()
          }
          console.log('changed:', key, 'to:', val)
        },
        get: () => {
          return this.__attrs[key]
        }
      })
      this[key] = val
    }
  }
}