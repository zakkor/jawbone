
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
      if (val.constructor.name === 'Array') {
        let proxy = new Proxy(val, {
          get: (target, name) => {
            return target[name]
          },
          set: (target, name, value) => {
            target[name] = value

            // trigger change event
            if (this.onChange !== undefined) {
              this.onChange()
            }

            return true
          }
        })
        val = proxy

        // Object.defineProperty(this, key, {
        //   set: val => {
        //     this.__attrs[key] = val
  
        //     // trigger change event
        //     if (this.onChange !== undefined) {
        //       this.onChange()
        //     }
        //   },
        //   get: () => {
        //     return this.__attrs[key]
        //   }
        // })
        // this[key] = proxy
      }

      Object.defineProperty(this, key, {
        set: val => {
          this.__attrs[key] = val

          // trigger change event
          if (this.onChange !== undefined) {
            this.onChange()
          }
        },
        get: () => {
          return this.__attrs[key]
        }
      })
      this[key] = val
    }
  }
}