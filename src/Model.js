
// export default class Model {
//   static spec = undefined
//   __attrs = null


//   constructor(attrs) {
//     if (attrs) {
//       this.spec = attrs
//     } else {
//       this.spec = this.constructor.attrs
//     }
//     this.init()
//   }

//   init() {
//     this.__attrs = {}

//     for (let [key, val] of Object.entries(this.spec)) {
//       if (val.constructor.name === 'Array') {
//         let proxy = new Proxy(val, {
//           get: (target, name) => {
//             return target[name]
//           },
//           set: (target, name, value) => {
//             target[name] = value

//             // trigger change event
//             if (this.onChange !== undefined) {
//               this.onChange()
//             }

//             return true
//           }
//         })
//         val = proxy

//         // Object.defineProperty(this, key, {
//         //   set: val => {
//         //     this.__attrs[key] = val
  
//         //     // trigger change event
//         //     if (this.onChange !== undefined) {
//         //       this.onChange()
//         //     }
//         //   },
//         //   get: () => {
//         //     return this.__attrs[key]
//         //   }
//         // })
//         // this[key] = proxy
//       }

//       Object.defineProperty(this, key, {
//         set: val => {
//           this.__attrs[key] = val

//           // trigger change event
//           if (this.onChange !== undefined) {
//             this.onChange()
//           }
//         },
//         get: () => {
//           return this.__attrs[key]
//         }
//       })
//       this[key] = val
//     }
//   }
// }

const Model = {}

const Observable = (inst) => {
  for (let [key, val] of Object.entries(inst.__props)) {
    if (val.constructor.name === 'Array') {
      console.log('array')

      let proxy = new Proxy(val, {
        get: (target, name) => {
          return target[name]
        },
        set: (target, name, value) => {
          target[name] = value

          console.log('set arr')

          // trigger change event
          if (inst.onChange !== undefined) {
            inst.onChange()
          }

          return true
        },
        __jawbone_meta_isproxy: true
      })
    
      val = proxy
    }

    console.log('val:', val)
    // inst.__props[key] = val

    Object.defineProperty(inst, key, {
      set: val => {
        inst.__props[key] = val

        console.log('set')
        // trigger change event
        if (inst.onChange !== undefined) {
          inst.onChange()
        }
      },
      get: () => {
        console.log('get:')
        console.log('inst.__props[key].constructor:', inst.__props[key].constructor)
        console.log('inst.__props[key].constructor.name:', inst.__props[key].constructor.name)
        console.log('inst.__props[key]:', inst.__props[key])
        
        
        if (inst.__props[key].constructor.name === 'Proxy') {
          console.log('proxy')
        }

        return inst.__props[key]
      }
    })
    inst[key] = val
  }
}

// extend
Object.defineProperty(Model, 'extend', {
  configurable: false,
  enumerable: false,
  writable: false,

  value: (opts) => {
    let inst = {}

    inst.__props = opts.props

    Observable(inst)

    return inst    
  }
})

export default Model